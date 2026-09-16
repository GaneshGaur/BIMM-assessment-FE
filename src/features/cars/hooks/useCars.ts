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

export const useCars = (variables?: GetCarsVariables) => {
  const { data, loading, error, refetch } = useQuery<GetCarsData, GetCarsVariables>(
    GET_CARS,
    { variables, notifyOnNetworkStatusChange: true }
  );

  const [createCarMutation, { loading: isCreating, error: createError }] = useMutation<
    CreateCarData,
    CreateCarVariables
  >(CREATE_CAR, {
    refetchQueries: [{ query: GET_CARS }],
    update(cache, { data: res }) {
      if (!res?.createCar) return;
      const newCar = res.createCar;

      try {
        const cached = cache.readQuery<GetCarsData>({ query: GET_CARS });
        if (cached?.cars && !cached.cars.some((c) => c.id === newCar.id)) {
          cache.writeQuery<GetCarsData>({
            query: GET_CARS,
            data: { cars: [...cached.cars, newCar] },
          });
        }
      } catch (_e) {
        void _e;
      }
    },
  });

  const createCar = async (input: CreateCarInput): Promise<Car> => {
    const res = await createCarMutation({ variables: { input } });
    if (!res.data?.createCar) throw new Error("Failed to create car");
    return res.data.createCar;
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