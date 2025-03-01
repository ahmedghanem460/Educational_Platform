import { View, Text, StyleSheet, ScrollView } from 'react-native';

const teamMembers = [
  { name: 'Ahmed mohamed',   id: '2227009', email: 'ahmedmohamedghanem083@gmail.com' },
  { name: 'Kareem abdullah', id: '2227252', email:'bambokareem72@gmail.com'},
  { name: 'Yousef hesham',   id: '2227049', email: 'youseefhisham9@gmail.com'},
  { name: 'Ziad ahmed',      id: '2227298', email: 'Ziada9703@gmail.com'},
  { name: 'Amr ahmed',       id: '2227009', email: 'amrahmed757574@gmail.com'},
  { name: 'Ahmed aymen',     id: '2227295', email: 'ahmedaymanmido307@gmail.com'},
  { name: 'Kareem waheed',   id: '2127238', email: 'karimwaheed263@gmail.com'},
  { name: ' Mohamed yasser', id: '2227283', email: 'mohamedyasserelhwary813@gmail.com'},

];
export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Team members </Text>
      {teamMembers.map((member, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.name}>{member.name}</Text>
          <Text style={styles.info}>ID: {member.id}</Text>
          {member.email ? <Text style={styles.info}>📧 {member.email}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8f8f8',
  },
  info: {
    color: '#ccc',
    fontSize: 14,
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
});
