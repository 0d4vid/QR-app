export const toastConfig = {
    success: ({text1, props, ...rest}) => (
        <View style={{
            backgroundColor: '#4CAF50',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20
        }}>
            <Text style={{color: 'white'}}>{text1}</Text>
        </View>
    ),

    error: ({text1, props, ...rest}) => (
        <View style={{
            backgroundColor: '#ff4444',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20
        }}>
            <Text style={{color: 'white'}}>{text1}</Text>
        </View>
    ),

    info: ({text1, props, ...rest}) => (
        <View style={{
            backgroundColor: '#2196F3',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20
        }}>
            <Text style={{color: 'white'}}>{text1}</Text>
        </View>
    ),
};