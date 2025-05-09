import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'

interface ButtonProps {
  text: string;
  type?: "fill" | "outline";
  onPress: () => void;
  loading?: boolean;
}

const Button = ({ text, type = "fill", onPress, loading }: ButtonProps) => {
  return (
    <Pressable onPress={onPress} style={{
        padding:15,
        width: '100%',
        borderRadius:15,
        marginTop:15,
        borderWidth:1,
        borderColor: type === "fill" ? "#007bff" : "#007bff",
        backgroundColor: type === "fill" ? "#007bff" : "white",
      }}
        disabled={loading}
      >
        
      {
        !loading ? <Text style={{
          textAlign: 'center',
          fontSize:18,
          color:type === "fill" ? "white" : "#007bff",
        }}>{text}</Text>
      :
        <ActivityIndicator size="small" color={type === "fill" ? "white" : "#007bff"} />
      }
      
    </Pressable>
  )
}

export default Button