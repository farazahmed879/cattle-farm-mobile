import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../theme';

// Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import UserDashboard from '../screens/User/UserDashboard';
import AnimalManagementScreen from '../screens/Admin/AnimalManagementScreen';
import UserManagementScreen from '../screens/Admin/UserManagementScreen';
import AdminDashboard from '../screens/Admin/AdminDashboard';
import AddAnimalScreen from '../screens/Admin/AddAnimalScreen';
import PaymentVerificationScreen from '../screens/Finance/PaymentVerificationScreen';
import FinanceDashboard from '../screens/Finance/FinanceDashboard';
import AssignedAnimalsScreen from '../screens/Worker/AssignedAnimalsScreen';
import WorkerDashboard from '../screens/Worker/WorkerDashboard';

import AnimalListScreen from '../screens/Animals/AnimalListScreen';
import AnimalDetailsScreen from '../screens/Animals/AnimalDetailsScreen';
import PurchaseScreen from '../screens/Animals/PurchaseScreen';
import MyAnimalsScreen from '../screens/User/MyAnimalsScreen';
import ProfileScreen from '../screens/Common/ProfileScreen';

const Stack = createStackNavigator();

const commonHeaderOptions = (logout: () => void, navigation: any) => ({
  headerRight: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Profile')} 
        style={{ marginRight: 15 }}
      >
        <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
        <Text style={{ color: COLORS.error, fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  ),
});

import { View } from 'react-native';

const AdminStack = ({ navigation }: any) => {
  const logout = useAuthStore(state => state.logout);
  return (
    <Stack.Navigator screenOptions={commonHeaderOptions(logout, navigation)}>
      <Stack.Screen name="AdminHome" component={AdminDashboard} options={{ title: 'Admin Panel' }} />
      <Stack.Screen name="ManageAnimals" component={AnimalManagementScreen} options={{ title: 'Animals' }} />
      <Stack.Screen name="AddAnimal" component={AddAnimalScreen} options={{ title: 'Add/Edit Animal' }} />
      <Stack.Screen name="ManageUsers" component={UserManagementScreen} options={{ title: 'Users' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'User Profile' }} />
    </Stack.Navigator>
  );
};

const FinanceStack = ({ navigation }: any) => {
  const logout = useAuthStore(state => state.logout);
  return (
    <Stack.Navigator screenOptions={commonHeaderOptions(logout, navigation)}>
      <Stack.Screen name="FinanceHome" component={FinanceDashboard} options={{ title: 'Finance Panel' }} />
      <Stack.Screen name="VerifyPayments" component={PaymentVerificationScreen} options={{ title: 'Verify Payments' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
};

const WorkerStack = ({ navigation }: any) => {
  const logout = useAuthStore(state => state.logout);
  return (
    <Stack.Navigator screenOptions={commonHeaderOptions(logout, navigation)}>
      <Stack.Screen name="WorkerHome" component={WorkerDashboard} options={{ title: 'Worker Panel' }} />
      <Stack.Screen name="AssignedAnimals" component={AssignedAnimalsScreen} options={{ title: 'My Tasks' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
};

const AnimalStack = ({ navigation }: any) => {
  const logout = useAuthStore(state => state.logout);
  return (
    <Stack.Navigator screenOptions={commonHeaderOptions(logout, navigation)}>
      <Stack.Screen name="AnimalList" component={AnimalListScreen} options={{ title: 'Animals' }} />
      <Stack.Screen name="AnimalDetails" component={AnimalDetailsScreen} options={{ title: 'Details' }} />
      <Stack.Screen name="Purchase" component={PurchaseScreen} options={{ title: 'Purchase' }} />
      <Stack.Screen name="MyAnimals" component={MyAnimalsScreen} options={{ title: 'My Purchases' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Stack.Navigator>
  );
};

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, user, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const renderContent = () => {
    if (!isAuthenticated) {
      return <Stack.Screen name="Auth" component={AuthStack} />;
    }

    switch (user?.role) {
      case 'ADMIN':
        return <Stack.Screen name="AdminApp" component={AdminStack} />;
      case 'FINANCE':
        return <Stack.Screen name="FinanceApp" component={FinanceStack} />;
      case 'WORKER':
        return <Stack.Screen name="WorkerApp" component={WorkerStack} />;
      default:
        return <Stack.Screen name="UserApp" component={AnimalStack} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {renderContent()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
