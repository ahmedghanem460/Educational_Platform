import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <Pressable style={styles.button} onPress={() => router.push('/Admin/AddCourse')}>
        <Text style={styles.buttonText}>Add Course</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/Admin/UpdateCourse')}>
        <Text style={styles.buttonText}>Update Course</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push('/Admin/DeleteCourse')}>
        <Text style={styles.buttonText}>Delete Course</Text>
      </Pressable>
      {/* <Pressable style={styles.button} onPress={() => router.push('/Admin/RegisterAdmin')}>
        <Text style={styles.buttonText}>Add New Admin</Text>
      </Pressable> */}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f4f6f9', 
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222', 
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  button: {
    backgroundColor: '#1E90FF', 
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 4, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    height: 55,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2, 
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  containerWithPadding: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 4,
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3, 
  },
  picker: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  gradientButton: {
    backgroundColor: '#FF6347', 
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#FF6347',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 4,
  },
});

export default AdminDashboard;