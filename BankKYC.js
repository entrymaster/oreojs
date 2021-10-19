import React, { useState } from "react";
import { StyleSheet, Alert, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BankDetails from "../Components/BankDetails";
import PersonalDetails from "../Components/PersonalDetails";
import { useNavigation } from "@react-navigation/native";


const Tab = createMaterialTopTabNavigator();


const BankKYC = ({ route }) => {
    const navigation = useNavigation();
    const userID = route.params;
    const [isPersonalInfoChanged, setIsPersonalInfoChanged] = useState(false);

    // console.log(isPersonalInfoChanged + "form changed");

    const createAlert = () =>
        Alert.alert(
            "Incomplete Form !",
            "Please save personal information first !",
            [
                { text: "OK"  },
            ],
            { cancelable: false }
        );

    return (
        <View style={styles.mainContainer}>
            <Tab.Navigator
                swipeEnabled={!isPersonalInfoChanged}
                tabBarOptions={{
                    tabStyle: styles.tabStyle,
                    labelStyle: styles.labelStyle,
                    indicatorStyle: styles.indicatorStyle,
                }}
            >
                <Tab.Screen
                    name="Personal Information"
                    tabBarVisible={false}
                >
                    {() => <PersonalDetails
                        userID={userID}
                        disableBankDetails={setIsPersonalInfoChanged}
                    />}
                </Tab.Screen>
                <Tab.Screen
                    name="Bank Details"
                    listeners={{
                        tabPress: (e) => {
                            if (isPersonalInfoChanged) {
                                e.preventDefault();
                                createAlert();
                            }
                        },
                    }}
                >
                    {() => <BankDetails userID={userID} />}
                    </Tab.Screen>
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 10,
    },
    articleContainer: {
        paddingHorizontal: 12,
    },
    tabStyle: {
        height: 40,
    },
    labelStyle: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "none",
        height: "100%",
        margin: 0,
        width: "100%",
    },
    indicatorStyle: {
        backgroundColor: "#3BB44A",
    },
    BankDetailsItemContainer: {
        borderWidth: 1,
        padding: 14,
        borderRadius: 5,
        borderColor: "#C6C6C6",
        flexDirection: "row",
        marginTop: 15,
    },
    BankDetailsImgStyle: {
        alignSelf: "center",
        height: 28,
        width: 28,
        resizeMode: "contain",
    },
    BankDetailsTextInput: {
        paddingHorizontal: 14,
        fontSize: 16,
        width: "100%",
    },
    BankDetailsUploadContainer: {
        paddingTop: 20,
    },
    BankDetailsUploadText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    BankDetailsAddBtn: {
        borderWidth: 1,
        width: "34%",
        padding: 4,
        marginTop: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
        borderColor: "#1C8D1B",
    },
    BankDetailsAddBtnText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1C8D1B",
    },
    BankDetailsNextBtn: {
        backgroundColor: "#1C8D1B",
        marginTop: 35,
        borderRadius: 3,
        alignItems: "center",
        padding: 10,
    },
    BankDetailsNextBtnText: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#fff",
    },
    checkbox: {
        flexDirection: "row",
    },
    checkboxtext: {
        paddingTop: 17,
        fontSize: 15,
    },
    UploadImgStyle: {
        alignSelf: "center",
        height: 20,
        width: 20,
        resizeMode: "contain",
        marginLeft: 18,
    },
    overlaycontainer: {
        height: 350,
        width: 300,
    },
    choosestate: {
        textAlign: "center",
        paddingVertical: 5,
        fontSize: 20,
        color: "green",
        fontWeight: "bold",
    },
    listOverlay: {
        paddingVertical: 15,
        paddingHorizontal: 5,
    },
    statusTextOverlay: {
        fontSize: 17,
    },
    UploadDocs: {
        paddingTop: 12,
        color: "grey",
    },
    IDProofTextContainer: {
        flexDirection: "row",
    },
    StateOverlayStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "95%",
        paddingHorizontal: 14,
    },
    CheckBoxStyle: {
        flexDirection: "row",
        borderWidth: 1,
        marginTop: 14,
        borderRadius: 5,
        borderColor: "#C6C6C6",
    },
    SelectStateCity: {
        fontSize: 18,
    },
});

export default BankKYC;
