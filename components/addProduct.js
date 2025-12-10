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

export default function AddProduct({ isVisible, onClose, selectedProduct, mode }) {

  const initialValues = selectedProduct ? {
      name: selectedProduct.name || "",
      stock: selectedProduct.stock?.toString() || "",
      minStock: selectedProduct.minStock?.toString() || "",
      unitWeight: selectedProduct.unitWeight?.toString() || "",
      currenWeight: selectedProduct.currenWeight?.toString() || "",
      maxTemp: selectedProduct.maxTemp?.toString() || "",
      maxHumidity: selectedProduct.maxHumidity?.toString() || "",
      container: selectedProduct.container?.toString() || ""
  } : {
      name: "",
      stock: "",
      minStock: "",
      unitWeight: "",
      currenWeight: "",
      maxTemp: "",
      maxHumidity: "",
      container: ""
  };

  const productSchema = Yup.object().shape({
      name: Yup.string().required("Nombre del producto es requerido"),
      stock: Yup.number().required("Stock del producto es requerido"),
      minStock: Yup.number().required("Stock mínimo es requerido"),
      unitWeight: Yup.number().required("Peso unitario es requerido"),
      currenWeight: Yup.number().required("Peso actual es requerido"),
      maxTemp: Yup.string().required("Temperatura máxima es requerida"),
      maxHumidity: Yup.string().required("Humedad máxima es requerida"),
      conteiner: Yup.string()
  });

  const inputStyle =
    "rounded-xl border border-gray-300 w-full p-3 mt-1 mb-3 bg-gray-100";

  const labelStyle = "font-semibold text-black mt-1";

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
              {selectedProduct ? "Detalles del Producto" : "Agregar Nuevo Producto"}
            </Text>

            <ScrollView 
              className="flex-grow mb-2"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Formik
                initialValues={initialValues}
                validationSchema={productSchema}
                onSubmit={(values) => console.log("Producto enviado: ", values)}
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

                    <Text className={labelStyle}>Stock</Text>
                    <TextInput
                      className={inputStyle}
                      placeholder="10"
                      keyboardType="numeric"
                      onChangeText={handleChange("stock")}
                      onBlur={handleBlur("stock")}
                      value={values.stock}
                      editable={mode === "edit" || mode === "add"}
                    />
                    {errors.stock && touched.stock && (
                      <Text className="text-red-600 -mt-2 mb-2">{errors.stock}</Text>
                    )}

                    <Text className={labelStyle}>Stock mínimo</Text>
                    <TextInput
                      className={inputStyle}
                      placeholder="3"
                      keyboardType="numeric"
                      onChangeText={handleChange("minStock")}
                      onBlur={handleBlur("minStock")}
                      value={values.minStock}
                      editable={mode === "edit" || mode === "add"}

                    />
                    {errors.minStock && touched.minStock && (
                      <Text className="text-red-600 -mt-2 mb-2">{errors.minStock}</Text>
                    )}

                    <Text className={labelStyle}>Peso unitario</Text>
                    <TextInput
                      className={inputStyle}
                      placeholder="1.5"
                      keyboardType="numeric"
                      onChangeText={handleChange("unitWeight")}
                      onBlur={handleBlur("unitWeight")}
                      value={values.unitWeight}
                      editable={mode === "edit" || mode === "add"}
                    />
                    {errors.unitWeight && touched.unitWeight && (
                      <Text className="text-red-600 -mt-2 mb-2">{errors.unitWeight}</Text>
                    )}

                    <Text className={labelStyle}>Peso actual</Text>
                    <TextInput
                      className={inputStyle}
                      keyboardType="numeric"
                      placeholder="10"
                      onChangeText={handleChange("currenWeight")}
                      onBlur={handleBlur("currenWeight")}
                      value={values.currenWeight}
                      editable={mode === "edit" || mode === "add"}
                    />
                    {errors.currenWeight && touched.currenWeight && (
                      <Text className="text-red-600 -mt-2 mb-2">{errors.currenWeight}</Text>
                    )}

                    <Text className={labelStyle}>Máxima temperatura</Text>
                    <TextInput
                      className={inputStyle}
                      placeholder="25°C"
                      onChangeText={handleChange("maxTemp")}
                      onBlur={handleBlur("maxTemp")}
                      value={values.maxTemp}
                      editable={mode === "edit" || mode === "add"}
                    />
                    {errors.maxTemp && touched.maxTemp && (
                      <Text className="text-red-600 -mt-2 mb-2">{errors.maxTemp}</Text>
                    )}

                    <Text className={labelStyle}>Máxima humedad</Text>
                    <TextInput
                      className={inputStyle}
                      placeholder="60%"
                      onChangeText={handleChange("maxHumidity")}
                      onBlur={handleBlur("maxHumidity")}
                      value={values.maxHumidity}
                      editable={mode === "edit" || mode === "add"}
                    />
                    {errors.maxHumidity && touched.maxHumidity && (
                      <Text className="text-red-600 -mt-2 mb-2">{errors.maxHumidity}</Text>
                    )}

                    <Text className={labelStyle}>Contenedor</Text>
                    <TextInput
                      className={inputStyle}
                      placeholder="Contenedor 1"
                      onChangeText={handleChange("container")}
                      onBlur={handleBlur("container")}
                      value={values.container}
                      editable={mode === "edit" || mode === "add"}
                    />

                    <Text className={labelStyle}>Foto</Text>
                    <Image
                      source={require("../assets/icon.png")}
                      className="w-32 h-32 mt-2 self-start"
                      resizeMode="contain"
                      readOnly={mode != "edit"}
                    />

                    {!selectedProduct && (
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
