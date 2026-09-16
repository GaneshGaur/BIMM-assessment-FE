import { useMutation, useQuery } from "@apollo/client";
import { GET_CARS } from "../api/getCars";
import { CREATE_CAR } from "../api/createCar";
import type {
  Car,
  CreateCarData,
  CreateCarInput,
  CreateCarVariables,
  GetCarsData,
  GetCarsVariables,
} from "../types";

export interface UseCarsOptions {
  variables?: GetCarsVariables;
}

export interface UseCarsReturn {
  cars: Car[];
  loading: boolean;
  error: Error | undefined;
  refetch: (variables?: Partial<GetCarsVariables>) => Promise<unknown>;
  createCar: (input: CreateCarInput) => Promise<Car>;
  isCreating: boolean;
  createError: Error | undefined;
}

export const useCars = (options?: UseCarsOptions): UseCarsReturn => {
  const { data, loading, error, refetch } = useQuery<GetCarsData, GetCarsVariables>(
    GET_CARS,
    {
      variables: options?.variables,
      notifyOnNetworkStatusChange: true,
    }
  );

  const [createCarMutation, { loading: isCreating, error: createError }] = useMutation<
    CreateCarData,
    CreateCarVariables
  >(CREATE_CAR, {
    refetchQueries: [{ query: GET_CARS }],
    update(cache, { data: mutationData }) {
      if (!mutationData?.createCar) return;
      const newCar = mutationData.createCar;

      
      try {
        const existingData = cache.readQuery<GetCarsData>({
          query: GET_CARS,
        });

        if (existingData?.cars) {
          const alreadyExists = existingData.cars.some((c) => c.id === newCar.id);
          if (!alreadyExists) {
            cache.writeQuery<GetCarsData>({
              query: GET_CARS,
              data: {
                cars: [...existingData.cars, newCar],
              },
            });
          }
        }
      } catch (_err) {
       void _err;
      }
    },
  });

  const createCar = async (input: CreateCarInput): Promise<Car> => {
    const result = await createCarMutation({
      variables: { input },
    });

    if (!result.data?.createCar) {
      throw new Error("Failed to create vehicle: No data returned from mutation.");
    }

    return result.data.createCar;
  };

  return {
    cars: data?.cars ?? [],
    loading,
    error,
    refetch,
    createCar,
    isCreating,
    createError,
  };
};
