import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import "./global.css"
import { useState } from 'react';
import AddProduct from './components/addProduct';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";




export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [mode, setMode] = useState("add")

  const dataList = [
    { id: 1, name: "Cafe bien rico", stock: 10, minStock: "1", unitWeight: "100gr", currenWeight: "50gr", maxTemp: "50C", maxHumidity: "30", container: "si" },
    { id: 2, name: "Condones Tia rosa", stock: 5, minStock: "1", unitWeight: "100gr", currenWeight: "50gr", maxTemp: "50C", maxHumidity: "30", container: "si" },
    { id: 3, name: "Tortilla de maiz", stock: 20, minStock: "1", unitWeight: "100gr", currenWeight: "50gr", maxTemp: "50C", maxHumidity: "30", container: "si"},
    { id: 4, name: "Cacahuates", stock: 5, minStock: "1", unitWeight: "100gr", currenWeight: "50gr", maxTemp: "50C", maxHumidity: "30", container: "si"},
    { id: 5, name: "Chicharrones", stock: 1, minStock: "2", unitWeight: "100gr", currenWeight: "50gr", maxTemp: "50C", maxHumidity: "30", container: "si"},
  ]

  const insets = useSafeAreaInsets();

  const openAddProduct = () => {
    setSelectedProduct(null)
    setMode("add")
    setIsModalVisible(true)
  }

  const openViewProduct = (item) => {
    setSelectedProduct(item)
    setMode("view")
    setIsModalVisible(true)
  }

  const closeAddProduct = () => {
    setIsModalVisible(false)
  }

const renderItem = ({ item }) => {

  const renderRightActions = () => (
    <TouchableOpacity
      onPress={() => console.log("Eliminar:", item.name)}
      className="bg-red-600 w-24 justify-center items-center rounded-l-xl"
    >
      <Text className="text-white font-bold">Eliminar</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <TouchableOpacity onPress={() => openViewProduct(item)}>
        <View 
          className={`p-4 rounded-xl
            ${item.stock <= 3 ? 'bg-red-100 border border-red-300' : 'bg-white'}
          `}
          style={{
            borderLeftWidth: 6,
            borderLeftColor: item.stock <= 3 ? "#E53935" : "#1E88E5",
          }}
        >
          <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-sm text-gray-600">Stock: {item.stock}</Text>

          {item.stock <= 3 && (
            <Text className="text-red-700 font-medium mt-1">
              ⚠ Stock bajo — se recomienda pedir más
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};


  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <SafeAreaView 
          className="flex-1" 
          edges={[ 'left', 'right']} 
          style={{ backgroundColor: "#F4F7FB", paddingTop: insets.top }}
        >

          <View 
            className="w-full p-5"
            style={{
              backgroundColor: "#1E88E5",
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Text className="text-white text-3xl font-extrabold">PantryWatch</Text>
            <Text className="text-blue-200 text-base mt-1">Gestión inteligente de inventario</Text>
          </View>

          <View className="p-4 mt-2">
            <Text className="text-2xl font-bold text-gray-800">Inventario actual</Text>
          </View>

          <View className="flex-1">
            <FlatList
              data={dataList}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              className="p-4"
              ItemSeparatorComponent={() => <View className="h-4"/>}
            />
          </View>

          <TouchableOpacity
            onPress={openAddProduct}
            activeOpacity={0.9}
            style={{
              position: "absolute",
              bottom: 25,
              right: 25,
              backgroundColor: "#1E88E5",
              padding: 18,
              borderRadius: 50,
              elevation: 10,
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 }
            }}
          >
            <Text className="text-white text-lg font-bold">+</Text>
          </TouchableOpacity>

          <AddProduct
            isVisible={isModalVisible}
            onClose={closeAddProduct}
            selectedProduct={selectedProduct}
            mode={mode}
          />

        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
