import { View, Text, Button, Image,Modal, ScrollView, StyleSheet,StatusBar,TouchableOpacity, Alert } from "react-native";

export default function pratices(){
    return(
        <View style={{flex:1,backgroundColor:"lightblue"}}>
            <ScrollView>
            <StatusBar backgroundColor={'black'}></StatusBar>
            <View style={styles.navbar}>
                <Text style={styles.navtitile}>PKIET CGPA Tracker</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.containerhead}>Smart CGPA Calculator</Text>
                <Text style={styles.containercontent}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity, and perspective, such as "Our greatest glory is not in never falling. </Text>
            </View>
            <View style={styles.container1}>
                <Text style={styles.containerhead1}>Our Mission</Text>
                <Text style={styles.containercontent1}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity, and perspective, such as "Our greatest glory is not in never falling. </Text>
            </View>
            <View style={styles.congrid}>
                <View style={styles.container2}>
                    <Text style={styles.containerhead2}>Lightning Fast</Text>
                    <Text style={styles.containercontent2}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity. </Text>
                </View>
                <View style={styles.container2}>
                    <Text style={styles.containerhead2}>Lightning Fast</Text>
                    <Text style={styles.containercontent2}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity. </Text>
                </View>
                <View style={styles.container2}>
                    <Text style={styles.containerhead2}>Lightning Fast</Text>
                    <Text style={styles.containercontent2}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity. </Text>
                </View>
                <View style={styles.container2}>
                    <Text style={styles.containerhead2}>Lightning Fast</Text>
                    <Text style={styles.containercontent2}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity. </Text>
                </View>
                <View style={styles.container2}>
                    <Text style={styles.containerhead2}>Lightning Fast</Text>
                    <Text style={styles.containercontent2}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity. </Text>
                </View>
                <View style={styles.container2}>
                    <Text style={styles.containerhead2}>Lightning Fast</Text>
                    <Text style={styles.containercontent2}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity. </Text>
                </View>
            </View>
            <View>
                <Text style={styles.teamtitle}>Meet our Team</Text>
                <View style={styles.container1}>
                    <Text style={styles.containerhead1}>Lightning Fast</Text>
                    <Text style={styles.containercontent1}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity. </Text>
                </View>
                <View style={styles.container1}>
                    <Text style={styles.containerhead1}>Lightning Fast</Text>
                    <Text style={styles.containercontent1}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity. </Text>
                </View>
                <View style={styles.container1}>
                    <Text style={styles.containerhead1}>Lightning Fast</Text>
                    <Text style={styles.containercontent1}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity. </Text>
                </View>
            </View>
            <View style={styles.container}>
                <Text style={styles.containerhead}>Ready to calculate your CGPA </Text>
                <Text style={styles.containercontent}> Some of the "best" two-line quotes offer timeless wisdom on themes like resilience, authenticity, and perspective, such as "Our greatest glory is not in never falling. </Text>
                <TouchableOpacity style={styles.btn} onPress={()=> Alert.alert("Redirect", "CGPA Tracker")}>
                    <Text style={styles.btntext} >Start Calculating</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
    );
}

const styles=StyleSheet.create({
    navbar:{
        backgroundColor:"#ffffffff",
        marginTop:0,
        padding:10,
        alignItems:'center',
    },
    navtitile:{
        color:"#232867",
        fontSize:22,
        fontWeight:'bold',
    },
    container:{
        backgroundColor:"#232867",
        padding:20,
        alignItems:'center',
        borderRadius:20,
        marginTop:10,
        marginLeft:10,
        marginRight:10,
    },
    containerhead:{
        fontSize:20,
        fontWeight:600,
        color:'white',
    },
    containercontent:{
        marginTop:10,
        color:'#c1c1c7ff',
        fontSize:16,
        textAlign:'center',
    },
    container1:{
        backgroundColor:"#ffffffff",
        padding:20,
        alignItems:'center',
        borderRadius:20,
        marginTop:15,
        marginLeft:10,
        marginRight:10,
    },
    containerhead1:{
        fontSize:20,
        fontWeight:600,
        color:'#232867',
    },
    containercontent1:{
        marginTop:10,
        color:'#5b5c6bff',
        fontSize:16,
        textAlign:'center',
    },
    congrid:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    container2:{
        backgroundColor:"#ffffffff",
        padding:20,
        borderRadius:20,
        width:'44%',
        marginTop:15,
        alignItems:'center',
        marginLeft:10,
        marginRight:10,
        
    },
    containerhead2:{
        fontSize:18,
        fontWeight:600,
        color:'#232867',
    },
    containercontent2:{
        marginTop:10,
        color:'#5b5c6bff',
        fontSize:12,
        textAlign:'center',
    },
    teamtitle:{
        color:'#232867',
        fontSize:20,
        fontWeight:600,
        textAlign:'center',
    },
    btn:{
        backgroundColor:'#232867',
        marginTop:10,
        padding:10,
        borderColor:'white',
        borderWidth:2,
        borderRadius:5,
    },
    btntext:{
        backgroundColor:'#232867',
        color:'white',
        fontSize:18,
        fontWeight:600,
    }

});