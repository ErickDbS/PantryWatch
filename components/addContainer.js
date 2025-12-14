import { 
  View, 
  Modal, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  TextInput, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import { toast } from "../utils/toast";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { useState } from "react";


export default function AddContainer({ isVisible, onClose, selectedContainer, mode, getContainers, upcomingContainerData}) {

  const [isLoading, setIsLoading] = useState(false)
  const initialValues = selectedContainer ? {
      id: selectedContainer.containerId || "",
      name: selectedContainer.name || "",
      weight: selectedContainer.weight?.toString() || "",
      image: selectedContainer.image || "",
      grCapacity: selectedContainer.grCapacity?.toString() || ""
  } : {
      id: "",
      name: "",
      weight: "",
      image: "",
      grCapacity: ""
  };

  const containerSchema = Yup.object().shape({
      name: Yup.string().required("Nombre del contenedor es requerido"),
      weight: Yup.number().required("Peso del contenedor es requerido"),
      grCapacity: Yup.number().required("Capacidad de gramaje es requerido")
  });

  const inputStyle =
    "rounded-xl border border-gray-300 w-full p-3 mt-1 mb-3 bg-gray-100";

  const labelStyle = "font-semibold text-black mt-1";

  const createContainer = async (values) => {
    setIsLoading(true)
    try {
        const formData = new FormData()
        formData.append("nombre", values.name)
        formData.append("peso", values.weight)
        formData.append("capacidad_gr", values.grCapacity)
        if (values.image){
            formData.append("imagen", {
                uri: values.image,
                type: "image/jpeg",
                name: "container.jpg"
            })
        }

        await axios.post(`${process.env.API_LOCAL}/contenedor`,
            formData
        )
        getContainers()
        onClose()
        toast.success("Recipiente creado correctamente")
    } catch (error) {
        toast.error("Error al crear el recipiente")
        console.error("Error al crear el recipiente: ", error)
    } finally {
        setIsLoading(false)
    }
  }

  const updateContainer = async (values) => {
    setIsLoading(true)
    try {
        const formData = new FormData()
        formData.append("nombre", values.name)
        formData.append("peso", values.weight)
        formData.append("capacidad_gr", values.grCapacity)
        if (values.image){
            formData.append("imagen", {
                uri: values.image,
                type: "image/jpeg",
                name: "container.jpg"
            })
        }
        await axios.put(
        `${process.env.API_LOCAL}/contenedor/${values.id}`,
        formData
        );

        getContainers()
        onClose()
        toast.success("Recipiente editado correctamente")
    } catch (error) {
        onClose()
        toast.error("Error al intentar editar el recipiente")
        console.error("Error al actualizar el recipiente: ", error.response)
    } finally {
        setIsLoading(false)
    }
  }

    const pickImage = async (setImage) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
        Alert.alert("Permiso denegado", "Se necesita permiso para usar la galería.");
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
    });

    if (!result.canceled) {
        setImage(result.assets[0].uri);
    }
    };

    const takePhoto = async (setImage) => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.status !== "granted") {
            Alert.alert("Permiso denegado", "Se necesita permiso para usar la cámara.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 1,
            allowsEditing: true,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };



  return (
    <Modal 
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
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
              {selectedContainer ? "Detalles del Recipiente" : "Agregar Nuevo Recipiente"}
            </Text>

            <ScrollView 
              className="flex-grow mb-2"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Formik
                initialValues={{
                  ...initialValues,
                  weight: upcomingContainerData?.peso_detectado !== undefined ? String(upcomingContainerData.peso_detectado) : initialValues.weight
                }}
                validationSchema={containerSchema}
                onSubmit={(values) => {
                    if(mode === "edit"){
                        updateContainer(values)
                    } else {
                        createContainer(values)
                    }
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                  <View className="w-full">

                    <Text className={labelStyle}>Nombre</Text>
                    <TextInput
                      className={inputStyle}
                      placeholder="Café"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                      editable={mode === "edit" || mode === "add"}
                    />
                    {errors.name && touched.name && (
                      <Text className="text-red-600 -mt-2 mb-2">{errors.name}</Text>
                    )}

                    <Text className={labelStyle}>Peso</Text>
                    <TextInput
                      className={inputStyle}
                      placeholder="10"
                      keyboardType="numeric"
                      onChangeText={handleChange("weight")}
                      onBlur={handleBlur("weight")}
                      value={values.weight}
                      editable={mode === "edit" || mode === "add"}
                    />
                    {errors.weight && touched.weight && (
                      <Text className="text-red-600 -mt-2 mb-2">{errors.weight}</Text>
                    )}

                    <Text className={labelStyle}>Capacidad de gramaje</Text>
                    <TextInput
                      className={inputStyle}
                      placeholder="3"
                      keyboardType="numeric"
                      onChangeText={handleChange("grCapacity")}
                      onBlur={handleBlur("grCapacity")}
                      value={values.grCapacity}
                      editable={mode === "edit" || mode === "add"}

                    />
                    {errors.grCapacity && touched.grCapacity && (
                      <Text className="text-red-600 -mt-2 mb-2">{errors.grCapacity}</Text>
                    )}

                    <Text className={labelStyle}>Foto</Text>

                    <TouchableOpacity
                    onPress={() => {
                        if (mode !== "edit" && mode !== "add") return;

                        Alert.alert(
                        "Seleccionar imagen",
                        "¿Qué deseas hacer?",
                        [
                            { text: "Galería", onPress: () => pickImage((uri) => setFieldValue("image", uri)) },
                            { text: "Tomar foto", onPress: () => takePhoto((uri) => setFieldValue("image", uri)) },
                            { text: "Cancelar", style: "cancel" }
                        ]
                        );
                    }}
                    >
                    <Image
                        source={
                        values.image
                            ? { uri: values.image }
                            : require("../assets/icon.png")
                        }
                        className="w-32 h-32 mt-2 self-start rounded-xl bg-gray-200"
                        resizeMode="cover"
                    />
                    </TouchableOpacity>

                    {!selectedContainer && (
                      <TouchableOpacity 
                        className="mt-6 bg-[#1E88E5] p-4 rounded-xl"
                        onPress={handleSubmit}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF"/>
                        ) : (
                            <Text className="text-white text-center font-bold text-lg">
                                Agregar
                            </Text>
                        )}

                      </TouchableOpacity>
                    )}

                    {mode === "edit" && (
                      <TouchableOpacity 
                        className="mt-6 bg-[#1E88E5] p-4 rounded-xl"
                        onPress={handleSubmit}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF"/>
                        ) : (
                            <Text className="text-white text-center font-bold text-lg">
                                Actualizar
                            </Text>
                        )}

                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </Formik>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
