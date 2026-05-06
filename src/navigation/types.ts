export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type UserStackParamList = {
  Dashboard: undefined;
  AnimalDetails: { animalId: string };
  Purchase: { animalId: string };
  MyAnimals: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  ManageUsers: undefined;
  ManageAnimals: undefined;
};

export type FinanceStackParamList = {
  FinanceDashboard: undefined;
  PaymentProofs: undefined;
};

export type WorkerStackParamList = {
  WorkerDashboard: undefined;
  AssignedAnimals: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  UserApp: undefined;
  AdminApp: undefined;
  FinanceApp: undefined;
  WorkerApp: undefined;
};
