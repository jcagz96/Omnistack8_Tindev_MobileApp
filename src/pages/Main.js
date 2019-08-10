import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import AsyncStorage from '@react-native-community/async-storage'
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native'

import api from '../services/api'

import logo from '../assets/logo.png'
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'
import itsamatch from '../assets/itsamatch.png'

export default function Main( { navigation }){
    const id = navigation.getParam('user')
    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)

    console.log(id)

    useEffect(()=>{
        async function loadUsers() {                     // funcao que faz a chamada à api , para nao usar async na funcao useEffect ( nao é uma boa pratica)
            const response = await api.get('/devs',{
                headers: { 
                    user: id,
                }
            })
            setUsers(response.data)      // coloca na variavel users os valores dados pela api
        }
        loadUsers();                   // chamando a funcao logo em baixo
    }, [id])             //1º argumento é a funcao que eu quero executar, e o 2º parametro é quando é que eu quero executar a funcao normalmente variaveis dentro de um array e sempre que essas variaveis sofrerem alteraçoes a funcao é chamada de novo | neste caso usou-se o match . parms.id que significa que cada vez que o id for alterado será despoletada a funcao

    useEffect(()=>{
        
        const socket = io('http://192.168.1.104:3333', {
            query: { user: id}                  //2º argumento que pode ser enviado na conexao
        })

        socket.on('match', dev =>{
            setMatchDev(dev)
        })

    }, [id])

    async function handleLike(){
        const [ user, ...rest ] = users              //user pega na primeira posicao do array, é equivalente a ter: const user = users[0]  | ...rest é os restantes elementos

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id},
        })
        setUsers(rest)
    }

    async function handleDislike(){
        const [ user, ...rest ] = users 

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id},
        })
        setUsers(rest)
    }


    async function handleLogout(){
        await AsyncStorage.clear()

        navigation.navigate('Login')
    }

    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo}/>
            </TouchableOpacity>
            

            <View style={styles.cardsContainer}>
                { users.length === 0
                ? <Text style={styles.empty}>Acabou :(</Text>
                : (users.map((user, index) =>(
                    <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                        <Image style={styles.avatar} source={{ uri: user.avatar }}/>
                        <View style={styles.footer}>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                        </View>
                    </View>
                ))
                )}
            </View>

            { !matchDev && users.length > 0 && (
                <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLike}>
                    <Image source={like}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDislike}>
                    <Image source={dislike}></Image>
                </TouchableOpacity>
            </View>
            )}

            { matchDev && (
                <View style={[styles.matchContainer, { zIndex: users.length + 1 }]}>
                    <Image style={styles.matchImage} source={itsamatch}/>
                    <Image style={styles.matchAvatar} source={{uri: matchDev.avatar}}/>

                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>

                    <TouchableOpacity onPress={() => setMatchDev(null)}>  
                        <Text style={styles.closeMatch}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            )}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    logo:{
        marginTop: 30,
    },

    empty:{
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold',
    },

    cardsContainer:{
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
        
    },

    card:{
        borderWidth:1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
    },

    avatar:{
        flex:1,
        height: 300,
    },

    footer:{
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },

    bio:{
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18,

    },

    buttonsContainer:{
        flexDirection: 'row',
        marginBottom: 30,
    },

    button:{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    matchImage:{
        height: 60,
        resizeMode: 'contain'
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical:30,
    },

    matchName:{
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
    },

    matchBio:{
        marginTop:10,
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
    },

    closeMatch:{
        fontSize:16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    },




})