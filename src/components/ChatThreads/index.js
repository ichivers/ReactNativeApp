import EncryptedStorage from 'react-native-encrypted-storage';
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, SafeAreaView, View, Image, Pressable } from 'react-native';
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import formatDistance from 'date-fns/formatDistance'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
    },
    item: {
        padding: 10,
        fontSize: 18,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topic: {
        color: 'black'
    },
    message: {

    },
    distance: {
    },
    summary: {
        flex: 1,
        borderBottomColor: 'black',
        borderBottomWidth: 0.5,
    }
});

const Item = ({ item, distance }) => {
    const navigation = useNavigation();
    return (<Pressable style={styles.item}
            onPress={() => {
                console.log(item.id);
                navigation.navigate('Chat', {id: item.id});
            }}> 
            <View style={{}}>
                <Image source={{
                    uri: "https://pbs.twimg.com/profile_images/1021680352740499456/61CD38PN_400x400.jpg"
                }}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 60 / 2,
                        marginRight: 10
                    }} />

            </View>
            <View style={styles.summary}>
                <View style={{}}>
                    <Text style={styles.topic}>{item.topic}</Text>
                </View>
                <View style={{}}>
                    <Text style={styles.message}>Last message</Text>
                </View>
            </View>
            <View style={styles.distance}>
                <Text style={{}}>{distance}</Text>
            </View>
    </Pressable>)
}

const ChatThreads = (props) => {
    console.log('ChatThread screen');
    const navigation = useNavigation();
    const [chatThreads, setChatThreads] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);

    const renderItem = ({ item }) => {
        let distance = '';
        if (item.lastMessageReceivedOn !== undefined) {
            distance = formatDistance(
                item.lastMessageReceivedOn,
                new Date(),
                { addSuffix: true }
            );
        }
        return (
            <Item item={item} distance={distance} />
        )
    }

    const loadData = async () => {
        let endpoint = await EncryptedStorage.getItem('acs_endpoint');
        let token = await EncryptedStorage.getItem('acs_token');
        let chatClient = new ChatClient(endpoint, new AzureCommunicationTokenCredential(token));
        console.log('ChatThreads: Azure Communication Services ChatClient created');
        const threads = chatClient.listChatThreads();
        const iterator = threads[Symbol.asyncIterator]();
        let data = [];
        while (data.length < Infinity) {
            const { value, done } = await iterator.next();
            if (done) break;
            if (value.deletedOn === undefined)
                data.push(value);
        }
        setChatThreads(data)
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        loadData();
    }, [])

    return !loading ? (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={chatThreads}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
            />
        </SafeAreaView>
    ) : <LottieView source={require('../../animation.json')} autoPlay />
}

export default ChatThreads