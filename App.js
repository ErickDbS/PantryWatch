import { Text, View, FlatList, TouchableOpacity, Animated } from 'react-native';
import "./global.css"
import { useEffect, useState } from 'react';
import AddProduct from './components/addProduct';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import AddContainer from './components/addContainer';
import axios from 'axios';
import FlashMessage from "react-native-flash-message";
import { toast } from "./utils/toast"
import { useRef } from "react";
import { socket } from './socket/socket';
import GeminiResponse from './components/geminiResponse';


export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [mode, setMode] = useState("add")
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [selectedContainer, setSelectedContainer] = useState(null)
  const [products, setProducts] = useState([])
  const [containers, setContainers] = useState([])
  const [socketData, setSocketData] = useState([])
  const [isIaModalVisible, setIsIaModalVisible] = useState(false)
  const [geminiResponse, setGeminiResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleSpeedDial = () => {
    Animated.spring(animation, {
      toValue: isSpeedDialOpen ? 0 : 1,
      useNativeDriver: true,
    }).start();

    setIsSpeedDialOpen(!isSpeedDialOpen);
  };

  const insets = useSafeAreaInsets();

  const openIaModal = async () => {
    setGeminiResponse(null)
    setIsLoading(true)
    setIsIaModalVisible(true)
    await getIaRecipe()
  }

  const closeIaModal = () => {
    setIsIaModalVisible(false)
  }

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

  const openEditProduct = (item) => {
    setSelectedProduct(item)
    setMode("edit")
    setIsModalVisible(true)
  }

  const closeAddProduct = () => {
    setIsModalVisible(false)
  }

  const openAddContainer = () => {
    setSelectedContainer(null)
    setMode("add")
    setIsModalVisible(true)
  }

  const openViewContainer = (item) => {
    setSelectedContainer(item)
    setMode("view")
    setIsModalVisible(true)
  }

  const openEditContainer = (item) => {
    setSelectedContainer(item)
    setMode("edit")
    setIsModalVisible(true)
  }

  const closeAddContainer = () => {
    setSocketData(null)
    setIsModalVisible(false)
  }

  const getContainers = async () => {
    try {
      const response = await axios.get(`${process.env.API_LOCAL}/contenedor`)
    if (!response || !response.data || !Array.isArray(response.data.data)) {
      setContainers([]);
      return;
    }


      const list = response.data.data.map(item => ({
        containerId: item.id,
        name: item.nombre,
        weight: item.peso,
        image: item.imagen,
        grCapacity: item.capacidad_gr
      }))

      setContainers(list)
    } catch (error) {
        const status = error.response?.status;
      if (status === 404) {
        setContainers([]);
        return;
      }

      console.error("Error obteniendo los contenedores: ", error)
      toast.error("No se pudieron obtener los contenedores")

    }

  }

  const getProducts = async () => {
    try {
      const response = await axios.get(`${process.env.API_LOCAL}/productos`)
      if(!response || !response.data || !Array.isArray(response.data.data)){
        setProducts([])
        return
      }

      const list = response.data.data.map((item) => ({
        productId: item.id_producto,
        name: item.nombre,
        containerId: item.contenedor_id,
        unitWeight: item.peso_unitario,
        currentWeight: item.peso_actual,
        minStock: item.stock_minimo,
        currentStock: item.stock_actual,
        maxTemp: item.temp_max,
        maxHumidity: item.humedad_max,
        container: item.contenedor
      }))

      setProducts(list)
    } catch (error) {
      const status = error.response?.status
      if (status === 404){
        setProducts([])
        return
      }

      toast.error("Error al obtener los productos")
      console.error("Erro al obtener los productos: ", error)
    }
  }

  const getIaRecipe = async () => {
    try {
      const response = await axios.get(`${process.env.API_LOCAL}/contenedor/chef`)

      setGeminiResponse(response.data.receta)

    } catch (error) {
      console.error("Error generando la receta: ", error.response)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProducts = async (id) => {
    try {
      await axios.delete(`${process.env.API_LOCAL}/productos/${id}`)
      toast.success("Producto borrado correctamente")
      getProducts()
    } catch (error) {
      toast.error("Error al intentar eliminar un producto")
      console.error("Error al eliminar un producto: ", error.response)
    }
  }

  const deleteContainer = async (id) => {
    try {
      await axios.delete(`${process.env.API_LOCAL}/contenedor/${id}`)
      toast.success("Recipiente eliminado correctamente")
      getContainers()
    } catch (error) {
      toast.error("Error al intentar eliminar el recipiente")
      console.error("Error al eliminar un contenedor: ", error)
    }
  }

  useEffect(() => {
    getContainers()
    getProducts()
  }, [])

  useEffect(() => {
    socket.connect()

    socket.on("connect", () => {
      console.log("Socket conectado", socket.id)
    })

    socket.on("nuevo_bote_detectado", (data) => {

      setSegmentIndex(1)
      setSocketData(data)
      setIsModalVisible(true)
    })

    return () => {
      socket.off("nuevo_bote_detectado")
      socket.disconnect()
    }
  }, [])

const renderItemInventory = ({ item }) => {

  const renderRightActions = () => (
    <TouchableOpacity className="flex-row">
      <TouchableOpacity
        onPress={() => deleteProducts(item.productId)}
        className="bg-red-600 w-24 justify-center items-center rounded-l-xl"
      >
        <Text className="text-white font-bold">Eliminar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openEditProduct(item)}
        className="bg-yellow-500 w-24 justify-center items-center rounded-l-xl"
      >
        <Text className="text-white font-bold">Editar</Text>
      </TouchableOpacity>
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
            ${item.currentStock <= item.minStock ? 'bg-red-100 border border-red-300' : 'bg-white'}
          `}
          style={{
            borderLeftWidth: 6,
            borderLeftColor: item.currentStock <= item.minStock ? "#E53935" : "#1E88E5",
          }}
        >
          <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-sm text-gray-600">Stock: {item.currentStock}</Text>

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

const renderItemContainer = ({ item }) => {

  const renderRightActions = () => (
    <TouchableOpacity className="flex-row">
      <TouchableOpacity
        onPress={() => deleteContainer(item.containerId)}
        className="bg-red-600 w-24 justify-center items-center rounded-l-xl"
      >
        <Text className="text-white font-bold">Eliminar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openEditContainer(item)}
        className="bg-yellow-500 w-24 justify-center items-center rounded-l-xl"
      >
        <Text className="text-white font-bold">Editar</Text>
      </TouchableOpacity>
    </TouchableOpacity>

  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <TouchableOpacity onPress={() => openViewContainer(item)}>
        <View 
          className={`p-4 rounded-xl
            ${item.weight <= "10gr" ? 'bg-red-100 border border-red-300' : 'bg-white'}
          `}
          style={{
            borderLeftWidth: 6,
            borderLeftColor: item.weight <= "10gr" ? "#E53935" : "#1E88E5",
          }}
        >
          <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-sm text-gray-600">Peso: {item.weight}</Text>

          {item.weight <= "10gr" && (
            <Text className="text-red-700 font-medium mt-1">
              ⚠ Contenido bajo — se recomienda rellenar
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
        <FlashMessage position="top"/>
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

              <SegmentedControl
                values={["Inventario", "Recipientes"]}
                selectedIndex={segmentIndex}
                onChange={(event) =>
                  setSegmentIndex(event.nativeEvent.selectedSegmentIndex)
                }
                style={{
                  marginTop: 10
                }}
              />
              {segmentIndex === 0 ? (
            <>

                <View className="p-4 mt-2">
                  <Text className="text-2xl font-bold text-gray-800">Inventario actual</Text>
                </View>
                <View className="flex-1">
                  <FlatList
                    data={products}
                    renderItem={renderItemInventory}
                    keyExtractor={item => item.productId.toString()}
                    className="p-4"
                    ItemSeparatorComponent={() => <View className="h-4" />} />
                </View>
                  <Animated.View
                    style={{
                      position: "absolute",
                      bottom: 25 + 70,
                      right: 25,
                      opacity: animation,
                      transform: [
                        {
                          translateY: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        }
                      ]
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        toggleSpeedDial();
                        segmentIndex === 0 ? openAddProduct() : openAddContainer();
                      }}
                      className="bg-[#1E88E5] p-4 rounded-full mb-3 items-center"
                    >
                      <Text className="text-white font-bold">Agregar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        toggleSpeedDial();
                        openIaModal()
                      }}
                      className="bg-[#1E88E5] p-4 rounded-full"
                    >
                      <Text className="text-white font-bold">Preguntar a la IA</Text>
                    </TouchableOpacity>
                  </Animated.View>

                <TouchableOpacity
                  onPress={toggleSpeedDial}
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
                  <Text className="text-white text-lg font-bold">{isSpeedDialOpen ? "x" : "+"}</Text>
                </TouchableOpacity>
                  <AddProduct
                    isVisible={isModalVisible}
                    onClose={closeAddProduct}
                    selectedProduct={selectedProduct}
                    mode={mode} 
                    getProducts={getProducts}
                  />

                  <GeminiResponse
                    isIaModalVisible={isIaModalVisible}
                    onClose={closeIaModal}
                    upcomingIaResponse={geminiResponse}
                    isLoading={isLoading}
                  />
            </>
          ) : (
            <>
              <View className="p-4 mt-2">
                  <Text className="text-black font-bold text-2xl">Recipientes actuales</Text>
              </View>
              {containers.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-2xl text-gray-600/50 font-bold">No hay recipientes</Text>
                </View>
              ) : (
                    <FlatList
                      data={containers}
                      renderItem={renderItemContainer}
                      keyExtractor={item => item.containerId.toString()}
                      className="p-4"
                      ItemSeparatorComponent={() => <View className="h-4" />} 
                      />
              )}
              <View className="flex-1">
                </View>
                <TouchableOpacity
                    onPress={openAddContainer}
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

                  <AddContainer
                    isVisible={isModalVisible}
                    onClose={closeAddContainer}
                    selectedContainer={selectedContainer}
                    mode={mode} 
                    getContainers={getContainers}
                    upcomingContainerData={socketData}
                  />
            </>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
