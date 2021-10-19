import React, { useEffect, useState } from 'react'
import { StyleSheet, Image, Text, View, FlatList, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { CheckBox, Overlay, Divider } from 'react-native-elements';
import { showMessage } from "react-native-flash-message";
import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';
import ApiCatch from './ApiCatch';
import { useNavigation } from '@react-navigation/native';
import BottomButton from './BottomButton';

const PersonalDetails = (props) => {

    const navigation = useNavigation();
    const userID = props.userID;
    const [isLoading, setLoading] = useState();
    const [myData, setMyData] = useState([]);
    const [fullName, setFullName] = useState()
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState();
    const [mobile, setMobile] = useState();
    const [gender, setGender] = useState(null);
    const [address1, setAddress1] = useState();
    const [address2, setAddress2] = useState();
    const [pinCode, setPinCode] = useState();
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [state, setState] = useState('Select State');
    const [city, setCity] = useState('Select City');
    const [fileTypeOverlayVisible, setFileTypeOverlayVisible] = useState(false);
    const [stateVisible, setStateVisible] = useState(false);
    const [cityVisible, setCityVisible] = useState(false);
    const [IDFront, setIDFront] = useState('');
    const [IDBack, setIDBack] = useState('');
    const [editable, setEditable] = useState(true);

    useEffect(() => {
        if (myData.length) {
            let savedData = myData[0].fullname + myData[0].email + myData[0].mobile + myData[0].dob + myData[0].gender + myData[0].address + myData[0].address2 + myData[0].pincode + myData[0].city + myData[0].state + myData[0].aadhar_front_img + myData[0].aadhar_back_img;
            let filledData = fullName + email + mobile + dob + gender + address1 + address2 + pinCode + city + state + IDFront + IDBack;

            savedData == filledData ?
                props.disableBankDetails(false)
                :
                props.disableBankDetails(true)
        }
    }, [fullName, email, mobile, dob, gender, address1, address2, pinCode, city, state, IDFront, IDBack])

    useEffect(() => {
        getUserDetails();
        getStateList();
    }, []);

    useEffect(() => {
        if (myData.length) {
            if (myData[0].aadhar_front_img != 'None') {
                setIDFront(myData[0].aadhar_front_img);
                setIDBack(myData[0].aadhar_back_img);
            }
            if (myData[0].kyc_status == "Verified" || myData[0].kyc_status == "Submitted") {
                setEditable(false);
            }
            setFullName(myData[0].fullname);
            setEmail(myData[0].email);
            setMobile(myData[0].mobile);
            setDob(myData[0].dob);
            setGender(myData[0].gender);
            setAddress1(myData[0].address);
            setAddress2(myData[0].address2);
            setPinCode(myData[0].pincode);
            setState(myData[0].state);
            setCity(myData[0].city);
        }

    }, [myData])

    const getUserDetails = () => {
        try {
            setLoading('getUserDetails');
            fetch(global.MyURL + '/bridge/getUserDetails', {
                method: 'POST',
                timeout: 10000,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Auth-Token': 'Ezxe01MBXU2werWrW2Wi342ASDADAShyIIoKvmYI'
                },
                body: JSON.stringify({
                    "userId": (userID)
                })
            })
                .then((response) => response.json())
                .then((json) => {
                    // console.log(json);
                    setMyData(json.data)
                })
                .catch((error) => ApiCatch({ error: error, source: 'KYC - getProfileStatus' }))
                .finally(() => setLoading(false));
        } catch (error) {
            ApiCatch({ error: error, source: 'KYC - getProfileStatus' })
        }
    }

    const getStateList = () => {

        setLoading(true);
        fetch(global.MyURL + '/bridge/getStateandCity', {
            method: 'POST',
            timeout: 10000,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Auth-Token': 'QtLRxjAC4ulU19iyX0FzxU6VB5Wwm8cBbtlVkxsF'
            },
            body: JSON.stringify({
                "type": "state"
            })
        })
            .then((response) => response.json())
            .then((json) => {
                setStateList(json.data)
            })
    }
    // getting city list
    useEffect(() => {
        getCityList(state);
    }, [state])
    const getCityList = (state) => {
        fetch(global.MyURL + '/bridge/getStateandCity', {
            method: 'POST',
            timeout: 10000,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Auth-Token': 'QtLRxjAC4ulU19iyX0FzxU6VB5Wwm8cBbtlVkxsF'
            },
            body: JSON.stringify({
                "type": "city",
                "state": (state)
            })
        })
            .then((response) => response.json())
            .then((json) => {
                setCityList(json.data)
            })
    }

    const insertSlash = (val) => {
        let values = val.replace(/^(\d{2})(\d{2})/, '$1/$2/');
        setDob(values);
    }

    const _pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({
            });
            if (!result.cancelled) {
                imageSave(result.uri)
            } else
                setLoading(false)
        } catch (E) {
            console.log(E);
        }
    }

    let _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,

            });
            if (!result.cancelled) {
                imageSave(result.uri)
            }
        } catch (E) {
            console.log(E);
        }
    }

    const handleIDFrontValidation = () => {
        if (IDFront == '') {
            showMessage({
                message: "Please upload ID front side !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else
            setFileTypeOverlayVisible(true)
    }

    const imageSave = (imageURI) => {
        try {
            let localUri = (imageURI)
            let filename = localUri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            const profile_pic = {
                name: (filename),
                type: (type),
                uri: (localUri),
            }
            const formData = new FormData()
            formData.append("userid", (userID));
            formData.append('file_uploads', (profile_pic))
            // console.log(formData);
            IDFront == '' ? setLoading('idFront') : setLoading('idBack');

            fetch("https://www.rozgaarindia.com/msgboard/file_api", {
                method: "POST",
                timeout: 10000,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                    "Auth-token": "Ezxe01MBXU2werWrW2Wi342ASDADAShyIIoKvmYI",
                },
                body: formData,
            })
                .then((response) => response.json())
                //.then ((responseData) => console.log (responseData))
                .then((json) => {
                    // console.log(json);
                    if (json.status === "success") {
                        IDFront == '' ? setIDFront(json.data.path) : setIDBack(json.data.path)
                        showMessage({
                            message: "Your file has been uploaded sucessfully",
                            type: "success",
                            icon: "success",
                            duration: 3500,
                        });
                    } else if (json.data === false) {
                        showMessage({
                            message: "Please check your internet connection",
                            description:
                                "Please try again. If the problem persists contact support",
                            type: "danger",
                            icon: "danger",
                            duration: 3500,
                        });
                    }
                })
                .finally(() => setLoading(false))
                .catch((error) => console.error(error));
        } catch (error) {
            console.log("error----------------", error);
        }
    };

    const sendPersonalDetails = () => {
        try {
            setLoading('sendPersonalDetails');
            fetch(global.MyURL + '/bridge/sendPersonalDetails', {
                method: 'POST',
                timeout: 10000,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Auth-Token': 'Ezxe01MBXU2werWrW2Wi342ASDADAShyIIoKvmYI'
                },
                body: JSON.stringify({
                    "userId": (userID),
                    "address1": (address1),
                    "address2": (address2),
                    "city": (city),
                    "dob": (dob),
                    "email": (email),
                    "full_name": (fullName),
                    "gender": (gender),
                    "id_back": (IDBack),
                    "id_front": (IDFront),
                    "mobile": (mobile),
                    "pincode": (pinCode),
                    "state": (state),
                })
            })
                .then((response) => response.json())
                .then((json) => {
                    // console.log(json);
                    if (json.status == "success" && json.status_code == 200) {
                        navigation.navigate('Bank Details');
                    }
                })
                .catch((error) => ApiCatch({ error: error, source: 'KYC - sendPersonalStatus' }))
                .finally(() => setLoading(false));
        } catch (error) {
            ApiCatch({ error: error, source: 'KYC - sendPersonalStatus' })
        }
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;


    const nextCheck = () => {
        if (!fullName) {
            showMessage({
                message: "Please fill your name !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (!email) {
            showMessage({
                message: "Please fill your email address !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (reg.test(email) == false) {
            showMessage({
                message: "invalid email !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }

        else if (!mobile) {
            showMessage({
                message: "Please enter your mobile no. !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (mobile.length < 10) {
            showMessage({
                message: "Incorrect mobile number",
                description: "Please enter a valid 10 digit number",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (!dob) {
            showMessage({
                message: "Please enter your date of birth",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (!gender) {
            showMessage({
                message: "Please select your gender !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (!address1) {
            showMessage({
                message: "Please enter your address !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (state == 'Select State') {
            showMessage({
                message: "Please select your state !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (city == 'Select City') {
            showMessage({
                message: "Please select your city !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (!pinCode) {
            showMessage({
                message: "Please enter your pincode !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (IDFront == '') {
            showMessage({
                message: "Please upload ID front side !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else if (IDBack == '') {
            showMessage({
                message: "Please upload ID back side !",
                type: "warning",
                icon: "warning",
                duration: 3000
            });
        }
        else {
            sendPersonalDetails();

        }
    }

    const UploadView = (file, type) => {
        let extension = file.split('.').pop();


        if (file == '') {
            return (
                <TouchableOpacity onPress={() => type == 'front' ? setFileTypeOverlayVisible(true) : handleIDFrontValidation()}>
                    <View style={styles.BankDetailsAddBtn}>
                        <AntDesign name="pluscircleo" size={18} color="#1C8D1B" />
                        <Text style={styles.BankDetailsAddBtnText}>Add Files</Text>
                    </View>
                </TouchableOpacity>)
        }
        else {
            switch (extension) {
                case 'jpg':
                    return (<View style={styles.UploadMainView}>
                        <Image source={{ uri: file }} style={styles.UploadMainViewImage} />
                        <TouchableOpacity
                            disabled={!editable}
                            onPress={() => type == 'front' ? setIDFront('') : setIDBack('')}
                            style={styles.UploadMainViewIcon}
                        >
                            <Entypo name="circle-with-cross" size={22} color="black" />
                        </TouchableOpacity>
                    </View>)
                case 'png':
                    return (<View style={styles.UploadMainView}>
                        <Image source={{ uri: file }} style={styles.UploadMainViewImage} />
                        <TouchableOpacity
                            disabled={!editable}
                            onPress={() => type == 'front' ? setIDFront('') : setIDBack('')}
                            style={styles.UploadMainViewIcon}
                        >
                            <Entypo name="circle-with-cross" size={22} color="black" />
                        </TouchableOpacity>
                    </View>)
                case 'jpeg':
                    return (<View style={styles.UploadMainView}>
                        <Image source={{ uri: IDFront }} style={styles.UploadMainViewImage} />
                        <TouchableOpacity
                            disabled={!editable}
                            onPress={() => type == 'front' ? setIDFront('') : setIDBack('')}
                            style={styles.UploadMainViewIcon}
                        >
                            <Entypo name="circle-with-cross" size={22} color="black" />
                        </TouchableOpacity>
                    </View>)
                case 'pdf':
                    return (<View style={styles.UploadMainView}>
                        <AntDesign name="pdffile1" size={50} color="grey" />
                        <TouchableOpacity
                            disabled={!editable}
                            onPress={() => type == 'front' ? setIDFront('') : setIDBack('')}
                            style={styles.UploadMainViewIcon}
                        >
                            <Entypo name="circle-with-cross" size={22} color="grey" />
                        </TouchableOpacity>
                    </View>)
                case 'doc':
                    return (<View style={styles.UploadMainView}>
                        <AntDesign name="wordfile1" size={50} color="grey" />
                        <TouchableOpacity
                            disabled={!editable}
                            onPress={() => type == 'front' ? setIDFront('') : setIDBack('')}
                            style={styles.UploadMainViewIcon}
                        >
                            <Entypo name="circle-with-cross" size={22} color="grey" />
                        </TouchableOpacity>
                    </View>)
                case 'docx':
                    return (<View style={styles.UploadMainView}>
                        <AntDesign name="wordfile1" size={50} color="grey" />
                        <TouchableOpacity
                            disabled={!editable}
                            onPress={() => type == 'front' ? setIDFront('') : setIDBack('')}
                            style={styles.UploadMainViewIcon}
                        >
                            <Entypo name="circle-with-cross" size={22} color="grey" />
                        </TouchableOpacity>
                    </View>)
                default:
                    console.log('file not supported');
                    return (<View style={styles.UploadMainView}>
                        <Text style={{ color: 'red' }}>File not Supported !</Text>
                        <TouchableOpacity
                            disabled={!editable}
                            onPress={() => type == 'front' ? setIDFront('') : setIDBack('')}
                        >
                            <Entypo name="circle-with-cross" size={18} color="#000" />
                        </TouchableOpacity>
                    </View>)
                    break;
            }
        }
    }

    return (
        isLoading == 'getUserDetails' ?
            <ActivityIndicator style={styles.ActivityIndicatorStyle} />
            :
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : null} keyboardVerticalOffset={100} style={styles.pageLayout}>
                <ScrollView style={styles.articleContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.BankDetailsItemContainer}>
                        <Image source={require('../assets/Account_Holder.png')} style={styles.BankDetailsImgStyle} />
                        <TextInput
                            editable={editable}
                            placeholder={'Enter your full name'}
                            style={styles.BankDetailsTextInput}
                            multiline={true}
                            value={fullName}
                            onChangeText={(text) => setFullName(text)}
                        />
                    </View>
                    <View style={styles.BankDetailsItemContainer}>
                        <Image source={require('../assets/email.png')} style={styles.BankDetailsImgStyle} />
                        <TextInput
                            editable={editable}
                            placeholder={'Email address'}
                            style={styles.BankDetailsTextInput}
                            multiline={true}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                    <View style={styles.BankDetailsItemContainer}>
                        <Image source={require('../assets/mobile.png')} style={styles.BankDetailsImgStyle} />
                        <TextInput
                            editable={editable}
                            placeholder={'Enter your mobile number'}
                            style={styles.BankDetailsTextInput}
                            multiline={true}
                            maxLength={10}
                            keyboardType={"number-pad"}
                            value={mobile}
                            onChangeText={(text) => setMobile(text)}
                        />
                    </View>
                    <View style={styles.BankDetailsItemContainer}>
                        <Image source={require('../assets/calender.png')} style={styles.BankDetailsImgStyle} />
                        <TextInput
                            editable={editable}
                            placeholder={'DD/MM/YYYY'}
                            style={styles.BankDetailsTextInput}
                            multiline={true}
                            maxLength={10}
                            keyboardType={"number-pad"}
                            onChangeText={(text) => insertSlash(text)}
                            value={dob}
                        />
                    </View>
                    {
                        editable ?
                            (
                                <View style={styles.CheckBoxStyle}>
                                    <View style={styles.checkbox}>
                                        <CheckBox
                                            activeOpacity={1}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            onPress={() => setGender('Male')}
                                            checked={gender == 'Male'}
                                            checkedColor={'#1C8D1B'}
                                        />
                                        <Text style={styles.checkboxtext}>Male</Text>
                                    </View>
                                    <View style={styles.checkbox}>
                                        <CheckBox
                                            activeOpacity={1}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            onPress={() => setGender('Female')}
                                            checked={gender == 'Female'}
                                            checkedColor={'#1C8D1B'}
                                        />
                                        <Text style={styles.checkboxtext}>Female</Text>
                                    </View>
                                    <View style={styles.checkbox}>
                                        <CheckBox
                                            activeOpacity={1}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            onPress={() => setGender('Other')}
                                            checked={gender == 'Other'}
                                            checkedColor={'#1C8D1B'}
                                        />
                                        <Text style={styles.checkboxtext}>Other</Text>
                                    </View>
                                </View>
                            ) :
                            (
                                <View style={styles.CheckBoxStyle}>
                                    <View style={styles.checkbox}>
                                        <CheckBox
                                            activeOpacity={1}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checked={gender == 'Male'}
                                            checkedColor={'#1C8D1B'}
                                        />
                                        <Text style={styles.checkboxtext}>Male</Text>
                                    </View>
                                    <View style={styles.checkbox}>
                                        <CheckBox
                                            activeOpacity={1}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checked={gender == 'Female'}
                                            checkedColor={'#1C8D1B'}
                                        />
                                        <Text style={styles.checkboxtext}>Female</Text>
                                    </View>
                                    <View style={styles.checkbox}>
                                        <CheckBox
                                            activeOpacity={1}
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checked={gender == 'Other'}
                                            checkedColor={'#1C8D1B'}
                                        />
                                        <Text style={styles.checkboxtext}>Other</Text>
                                    </View>
                                </View>
                            )
                    }

                    <View style={styles.BankDetailsItemContainer}>
                        <Image source={require('../assets/address.png')} style={styles.BankDetailsImgStyle} />
                        <TextInput
                            editable={editable}
                            placeholder={'Address Line 1'}
                            style={styles.BankDetailsTextInput}
                            multiline={true}
                            value={address1}
                            onChangeText={(text) => setAddress1(text)}
                        />
                    </View>
                    <View style={styles.BankDetailsItemContainer}>
                        <Image source={require('../assets/address.png')} style={styles.BankDetailsImgStyle} />
                        <TextInput
                            editable={editable}
                            placeholder={'Address Line 2'}
                            style={styles.BankDetailsTextInput}
                            multiline={true}
                            value={address2}
                            onChangeText={(text) => setAddress2(text)}
                        />
                    </View>
                    <View style={styles.BankDetailsItemContainer}>
                        <Image source={require('../assets/state.png')} style={styles.BankDetailsImgStyle} />
                        <View style={styles.StateOverlayStyle}>
                            <Text style={styles.SelectStateCity}>{state}</Text>
                            <TouchableOpacity disabled={!editable} onPress={() => setStateVisible(!stateVisible)}>
                                <AntDesign name="caretdown" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ----------State Overlay------------- */}
                    <Overlay isVisible={stateVisible} onBackdropPress={() => setStateVisible(!stateVisible)}>
                        <View style={styles.overlaycontainer}>
                            <Text style={styles.choosestate}>Choose State</Text>
                            <FlatList
                                data={stateList}
                                keyExtractor={item => item.keyIndex}
                                initialNumToRender={4}
                                renderItem={({ item }) => (
                                    <View>
                                        <TouchableOpacity onPress={() => { setState(item.state); setStateVisible(!stateVisible) }}>
                                            <View style={styles.listOverlay}>
                                                <Text style={styles.statusTextOverlay}> {item.state} </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <Divider />
                                    </View>
                                )} />
                        </View>
                    </Overlay>
                    {/* ----------State Overlay------------- */}

                    <View style={styles.BankDetailsItemContainer}>
                        <Image source={require('../assets/City.png')} style={styles.BankDetailsImgStyle} />
                        <View style={styles.StateOverlayStyle}>
                            <Text style={styles.SelectStateCity}>{(city == false) ? 'Select City' : city}</Text>
                            <TouchableOpacity disabled={!editable} onPress={() => setCityVisible(!cityVisible)}>
                                <AntDesign name="caretdown" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ----------- City overlay ----------- */}
                    <Overlay isVisible={cityVisible} onBackdropPress={() => setCityVisible(!cityVisible)}>
                        <View style={styles.overlaycontainer}>
                            <Text style={styles.choosestate}>Choose City</Text>
                            <FlatList
                                data={cityList}
                                keyExtractor={item => item.keyIndex}
                                initialNumToRender={4}
                                renderItem={({ item }) => (
                                    <View>
                                        <TouchableOpacity onPress={() => { setCity(item.value); setCityVisible(!cityVisible) }}>
                                            <View style={styles.listOverlay}>
                                                <Text style={styles.statusTextOverlay}> {item.value} </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <Divider />
                                    </View>
                                )} />
                        </View>
                    </Overlay>
                    {/* ----------- City overlay ----------- */}
                    <View style={styles.BankDetailsItemContainer}>
                        <Image source={require('../assets/IFSC.png')} style={styles.BankDetailsImgStyle} />
                        <TextInput
                            editable={editable}
                            placeholder={'Pincode'}
                            style={styles.BankDetailsTextInput}
                            multiline={true}
                            maxLength={6}
                            keyboardType={"number-pad"}
                            value={pinCode}
                            onChangeText={(text) => setPinCode(text)}
                        />
                    </View>
                    <View style={styles.BankDetailsUploadContainer}>
                        <View style={styles.IDProofTextContainer}>
                            <Text style={styles.BankDetailsUploadText}>Upload ID Proof</Text>
                            <Image source={require('../assets/I.png')} style={styles.UploadImgStyle} />
                        </View>
                        <Text style={styles.UploadDocs}>Upload document front side</Text>

                        {
                            isLoading == 'idFront' ? <ActivityIndicator style={{ alignSelf: 'flex-start' }} /> : UploadView(IDFront, 'front')
                        }

                    </View>
                    <Text style={styles.UploadDocs}>Upload document back side</Text>
                    {
                        isLoading == 'idBack' ? <ActivityIndicator style={{ alignSelf: 'flex-start' }} /> : UploadView(IDBack, 'back')
                    }

                    <TouchableOpacity disabled={!editable} onPress={() => nextCheck()} style={{ paddingVertical: 15 }}>
                        <BottomButton Btitle={isLoading == 'sendPersonalDetails' ? 'Loading' : 'Next'} />
                    </TouchableOpacity>

                    <Overlay overlayStyle={styles.OverLayDocPicker} isVisible={fileTypeOverlayVisible} onBackdropPress={() => setFileTypeOverlayVisible(false)}>
                        <View style={styles.fileOverlayContainer}>
                            <TouchableOpacity onPress={() => { setFileTypeOverlayVisible(false); _pickImage() }}>
                                <View style={styles.AddImageView}>
                                    <MaterialCommunityIcons name="image-plus" size={60} color="grey" />
                                </View>
                            </TouchableOpacity >
                            <TouchableOpacity onPress={() => { setFileTypeOverlayVisible(false); _pickDocument() }}>
                                <AntDesign name="pdffile1" size={60} color="grey" />
                            </TouchableOpacity>
                        </View>
                        <Divider style={{ marginBottom: 25 }} />
                        <TouchableOpacity onPress={() => setFileTypeOverlayVisible(false)}>
                            <BottomButton Btitle={'Cancel'} />
                        </TouchableOpacity>
                    </Overlay>
                </ScrollView>
            </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 10
    },
    ActivityIndicatorStyle: {
        flex: 1,
        justifyContent: 'center'
    },
    pageLayout: {
        flex: 1,
        backgroundColor: '#fff'
    },
    articleContainer: {
        paddingHorizontal: 12,
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    tabStyle: {
        height: 40,
    },
    labelStyle: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: 'none',
        height: '100%',
        margin: 0,
        width: '100%',
    },
    indicatorStyle: {
        backgroundColor: "#3BB44A",
    },
    BankDetailsItemContainer: {
        borderWidth: 1,
        padding: 14,
        borderRadius: 5,
        borderColor: '#C6C6C6',
        flexDirection: 'row',
        marginTop: 15
    },
    BankDetailsImgStyle: {
        alignSelf: 'center',
        height: 28,
        width: 28,
        resizeMode: 'contain'
    },
    BankDetailsTextInput: {
        paddingHorizontal: 14,
        fontSize: 16,
        width: '100%'
    },
    BankDetailsUploadContainer: {
        paddingTop: 20
    },
    BankDetailsUploadText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    BankDetailsAddBtn: {
        borderWidth: 1,
        width: '34%',
        padding: 4,
        marginTop: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderColor: '#1C8D1B'
    },
    BankDetailsAddBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C8D1B'
    },
    BankDetailsNextBtn: {
        backgroundColor: '#1C8D1B',
        marginTop: 35,
        borderRadius: 3,
        alignItems: 'center',
        padding: 10
    },
    BankDetailsNextBtnText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff'
    },
    checkbox: {
        flexDirection: 'row'
    },
    checkboxtext: {
        paddingTop: 17,
        fontSize: 15
    },
    UploadImgStyle: {
        alignSelf: 'center',
        height: 20,
        width: 20,
        resizeMode: 'contain',
        marginLeft: 18
    },
    overlaycontainer: {
        height: 350,
        width: 300
    },
    choosestate: {
        textAlign: 'center',
        paddingVertical: 5,
        fontSize: 20,
        color: 'green',
        fontWeight: 'bold',
    },
    listOverlay: {
        paddingVertical: 15,
        paddingHorizontal: 5,
    },
    statusTextOverlay: {
        fontSize: 17
    },
    UploadDocs: {
        paddingTop: 12,
        color: 'grey'
    },
    IDProofTextContainer: {
        flexDirection: 'row'
    },
    StateOverlayStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        paddingHorizontal: 14
    },
    CheckBoxStyle: {
        flexDirection: 'row',
        borderWidth: 1,
        marginTop: 14,
        borderRadius: 5,
        borderColor: '#C6C6C6',
    },
    SelectStateCity: {
        fontSize: 18
    },
    overlayCrossIcon: {
        alignSelf: 'flex-end',
        paddingBottom: 30
    },
    fileOverlayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 25
    },
    chooseFile: {
        textAlign: 'center',
        paddingVertical: 5,
        fontSize: 22,
        color: 'green',
        paddingHorizontal: 10
    },
    OverLayDocPicker: {
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 200
    },
    UploadMainView: {
        flexDirection: 'row',
        margin: 10
    },
    UploadMainViewImage: {
        height: 50,
        width: 50
    },
    UploadMainViewIcon: {
        right: 12,
        top: -10
    }
});

export default PersonalDetails
