import { Modal, Text, View, TouchableWithoutFeedback, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";


export default function GeminiResponse({isIaModalVisible, onClose, upcomingIaResponse, isLoading}){
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isIaModalVisible}
            onRequestClose={onClose}
        >

        <View className="flex-1 justify-center items-center bg-black/50">

          <View className="bg-white p-6 rounded-2xl w-11/12 shadow-2xl max-h-[88%]">

            <View className="w-full items-end mb-2" >
              <TouchableWithoutFeedback onPress={onClose}>
                <Ionicons name="close" size={28} color="black" />
              </TouchableWithoutFeedback>
            </View>

            <Text className="text-2xl font-bold text-white w-full p-5" 
                style={{
                    backgroundColor: "#1E88E5",
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                }}
            >
              Recta Inteligentes
            </Text>
            
            <ScrollView>
                <View className="flex items-center pt-2">
                    {isLoading ? (
                        <ActivityIndicator
                            color="#1E88E5"
                            size="large"
                        />
                    ) : upcomingIaResponse ? (
                        <Markdown
                            style={{
                                body: {
                                color: "#1f2937",
                                fontSize: 16,
                                lineHeight: 22,
                                },
                                heading2: {
                                fontSize: 20,
                                fontWeight: "bold",
                                marginTop: 12,
                                },
                                strong: {
                                fontWeight: "bold",
                                },
                                list_item: {
                                marginVertical: 4,
                                },
                            }}
                        >
                            {upcomingIaResponse}
                        </Markdown>
                    ): (
                        null
                    )}

                </View>
            </ScrollView>


            <ScrollView 
              className="flex-grow mb-2"
              showsVerticalScrollIndicator={false}
            >
                
            </ScrollView>
          </View>
        </View>

        </Modal>
    )
}