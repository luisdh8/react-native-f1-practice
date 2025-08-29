import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View, Image, Alert, Pressable } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { styles } from "../assets/css/requestStyles"; // ⬅️ estilos en archivo aparte

export default function RequestFunction() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});
  const fallbackImage = require("../assets/icon.png");

  useEffect(() => {
    async function fetchData() {
      try {
        // Consumir pilotos de la 2025 season
        const response = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
        const json = await response.json();

        // Validar y eliminar pilotos duplicados
        const uniqueDrivers = Array.from(
          new Map(json.map((d: any) => [d.driver_number, d])).values()
        )

          // Ordenar por nombre de equipo (team_name) A-Z
          .sort((a: any, b: any) => (a.team_name || "").localeCompare(b.team_name || ""))

          // Manejar cuando un piloto no una foto
          .map((d: any) => ({
            ...d,
            headshot_url:
              typeof d.headshot_url === "string" && /^(http|https):\/\//.test(d.headshot_url)
                ? d.headshot_url
                : null,
          }));

        // Actualizar estado con pilotos únicos y ordenados
        setDrivers(uniqueDrivers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // El tiempo de carga ha terminado
        setLoading(false);
      }
    }
    fetchData();
  }, []);

    const showDriverDetails = (driver: any) => {
        Alert.alert(
        driver.full_name || "Unknown Driver",
        `Broadcast Name: ${driver.broadcast_name || "N/D"}\n` +
        `Acronym: ${driver.name_acronym || "N/D"}\n` +
        `Meeting Key: ${driver.meeting_key || "N/D"}`
        );
    };

  return (
    <SafeAreaProvider>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
            data={drivers}
            keyExtractor={(item) => item.driver_number?.toString()}
            renderItem={({ item }) => {
                const isBroken = item.driver_number && brokenImages[item.driver_number];
                const showFallback = isBroken || !item.headshot_url;
                return (
                // ⬅️ Envolvemos en Pressable
                <Pressable
                    onPress={() => showDriverDetails(item)}
                    android_ripple={{ color: "#ccc" }} // opcional, efecto ripple en Android
                    style={({ pressed }) => [
                    styles.row,
                    pressed && { opacity: 0.6 }, // efecto al presionar
                    ]}
                >
                    <Image
                    source={showFallback ? fallbackImage : { uri: item.headshot_url }}
                    style={styles.avatar}
                    onError={() => {
                        if (item.driver_number) {
                        setBrokenImages((prev) => ({ ...prev, [item.driver_number]: true }));
                        }
                    }}
                    />
                    <View>
                    <Text style={styles.name}>{item.full_name || "Piloto desconocido"}</Text>
                    <Text style={styles.meta}>Team: {item.team_name || "N/D"}</Text>
                    <Text style={styles.meta}>Number: {item.driver_number ?? "—"}</Text>
                    </View>
                </Pressable>
                );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
        />

      )}
    </SafeAreaProvider>
  );
}
