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
  Platform 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";

export default function AddContainer({ isVisible, onClose, selectedContainer, mode, getContainers }) {

  const initialValues = selectedContainer ? {
      id: selectedContainer.id || "",
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

        await axios.post(`${process.env.API_URL}/contenedor`,
            formData
        )
        getContainers()
        onClose()
    } catch (error) {
        console.error("Error al crear el recipiente: ", error)
    }
  }

  const updateContainer = async (values) => {
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
        await axios.put(`${process.env.API_URL}/contenedor/${selectedContainer.id}`,
            formData
        )
        getContainers()
        onClose()
    } catch (error) {
        console.error("Error al actualizar el recipiente: ", error)
    }
  }

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
                initialValues={initialValues}
                validationSchema={containerSchema}
                onSubmit={(values) => {
                    if(mode === "edit"){
                        updateContainer(values)
                    } else {
                        createContainer(values)
                    }
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
                    <Image
                      source={{ uri: values.image}}
                      className="w-32 h-32 mt-2 self-start"
                      resizeMode="contain"
                      editable={mode === "edit" || mode === "add"}
                    />

                    {!selectedContainer && (
                      <TouchableOpacity 
                        className="mt-6 bg-[#1E88E5] p-4 rounded-xl"
                        onPress={handleSubmit}
                      >
                        <Text className="text-white text-center font-bold text-lg">
                          Agregar
                        </Text>
                      </TouchableOpacity>
                    )}

                    {mode === "edit" && (
                      <TouchableOpacity 
                        className="mt-6 bg-[#1E88E5] p-4 rounded-xl"
                        onPress={handleSubmit}
                      >
                        <Text className="text-white text-center font-bold text-lg">
                          Actualizar
                        </Text>
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
