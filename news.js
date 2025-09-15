import { View,Text, StyleSheet} from "react-native";

export default function news(){
    return(
        <View style={styles.container}>
            <View style={styles.box}>
                <Text>qwertyuiopasdfghjklzxcvbnm</Text>
            </View>
            <View style={styles.box}>
                <Text>qwertyuiopasdfghjklzxcvbnm</Text>
            </View>
            <View style={styles.box}>
                <Text>qwertyuiopasdfghjklzxcvbnm</Text>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        backgroundColor:'lightblue',
        color:'white',
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap',
        
    },
    box:{
        margin:30,
        padding:10,
        width:'30%',
        backgroundColor:'white',
        color:'blue',
        elevation:10,
    }
})