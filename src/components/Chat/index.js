import React, { useEffect, useState } from 'react'
import EncryptedStorage from 'react-native-encrypted-storage';
import LottieView from 'lottie-react-native';
import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { FlatList, StyleSheet, Text, SafeAreaView, View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommunicationSignalingClient } from '@azure/communication-signaling';
import { id } from 'date-fns/locale';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0
    },
    fromMe: {
        backgroundColor: 'lightgrey',
        maxWidth: '75%',
        alignSelf: 'flex-start',
        padding: 10,
        margin: 10,
        borderRadius: 10
    },
    fromSender: {
        backgroundColor: 'lightblue',
        maxWidth: '75%',
        alignSelf: 'flex-end',
        padding: 10,
        margin: 10,
        borderRadius: 10
    },
    input: {
        backgroundColor: 'white',
        margin: 10,
        fontSize: 16,
        color: 'black',
        borderRadius: 10
    }
})

const Item = ({ item, userId }) => {
    return (
        <View style={userId === item.senderId ? styles.fromSender : styles.fromMe}>
            <Text style={{ color: 'black', fontSize: 16 }}>{item.message}</Text>
        </View>
    )
}

const Chat = (props) => {

    console.log('Chat screen');

    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [userId, setUserId] = useState(null)
    const [message, setMessage] = useState(null);
    const [messageSubmitted, setMessageSubmitted] = useState(null);
    const [messageReceived, setMessageReceived] = useState(null);
    const navigation = useNavigation();

    const loadData = async () => {
        console.log('loadData');
        let endpoint = await EncryptedStorage.getItem('acs_endpoint');
        let token = await EncryptedStorage.getItem('acs_token');
        let userId = await EncryptedStorage.getItem('acs_userid');
        setUserId(userId);
        global.chatClient = new ChatClient(endpoint, new AzureCommunicationTokenCredential(token));
        console.log('Chat: Azure Communication Services ChatClient created');
        await chatClient.startRealtimeNotifications();
        chatClient.on("chatMessageReceived", (chatMessageReceived) => {
            setMessageReceived(chatMessageReceived);
        });
        global.threadClient = await chatClient.getChatThreadClient(props.route.params.id);
        let messages = threadClient.listMessages();
        const iterator = messages[Symbol.asyncIterator]();
        let data = [];
        while (data.length < Infinity) {
            const { value, done } = await iterator.next();
            if (done) break;
            if (value.type === 'text')
                data.unshift({
                    id: value.id,
                    message: value.content.message,
                    createdOn: value.createdOn,
                    senderId: value.sender.communicationUserId
                });
            console.log(value);
        }
        setChatMessages(data)
        setLoading(false);
    }
    useEffect(() => {
        if (!loading) {
            setLoading(true);
            loadData();
        }
        return () => {
            navigation.addListener('beforeRemove', (e) => {
                chatClient.stopRealtimeNotifications();
            });
        }
    }, [])

    useEffect(() => {
        (async () => {
            console.log('useEffect messageSubmitted');
            console.log(messageSubmitted);
            const sendMessageRequest =
            {
                content: messageSubmitted
            };
            const sendMessageOptions =
            {
                //senderDisplayName: displayName,
                type: 'text'
            };
            const sendChatMessageResult = await global.threadClient.sendMessage(sendMessageRequest, sendMessageOptions);
            const messageId = sendChatMessageResult.id;
            console.log(sendChatMessageResult)
        })();
    }, [messageSubmitted])

    useEffect(() => {
        console.log('useEffect messageReceieved');
        if (messageReceived !== null) {            
            if (chatMessages.filter(m => m.id == messageReceived.id).length === 0) {
                console.log(messageReceived);
                let data = {
                    id: messageReceived.id,
                    message: messageReceived.message,
                    createdOn: messageReceived.createdOn,
                    senderId: messageReceived.sender.communicationUserId
                }
                console.log('existing messages');
                console.log(chatMessages);
                chatMessages.push(data);
                console.log('updated list');
                console.log(chatMessages);
                setChatMessages(chatMessages);
            }
        }
    }, [messageReceived])

    const renderItem = ({ item }) => {
        return (
            <Item item={item} userId={userId} />
        )
    }

    const submitMessage = async () => {
        console.log(message);
        setMessageSubmitted(message);
    }

    return (
        !loading ? (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={chatMessages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        extraData={selectedId}
                    />
                </View>
                <View style={{ backgroundColor: 'lightgrey' }}>
                    <TextInput
                        placeholder="Type a message"
                        style={styles.input}
                        onChangeText={setMessage}
                        onSubmitEditing={submitMessage}
                        value={message}
                    />
                </View>
            </SafeAreaView>
        ) :
            <LottieView source={require('../../animation.json')} autoPlay />
    )
}

export default Chat