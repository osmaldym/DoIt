import { Dispatch, PropsWithChildren, RefObject, SetStateAction, createContext, useContext, useState } from "react";
import { DrawerLayoutAndroid, Image, StyleSheet } from "react-native";
import { Row } from "./arrangements";
import { Drawer } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AppRoutes from "../enums/routes.enum";
import { AuthContext, GuardData, useAuthGuard } from "../hooks/auth.guard";
import { AppDefTheme } from "../theme/colors";
import { SimpleAlert } from "./simpleAlert";

// Types
type MenuItem = {
    label: 'Home' | 'Tags' | 'Profile' | 'Logout',
    icon: string,
    route?: AppRoutes,
    onPress?: () => void,
}

type MenuViewProps = PropsWithChildren<{
    showDialog: boolean,
    setShowDialog: Dispatch<SetStateAction<boolean>>,
}>

// Imports and necessary code to export or use here
const LOGO = require('../assets/logo.png')
const drawerWidth: number = 300;

export const MenuContext = createContext({} as RefObject<DrawerLayoutAndroid>);

/**
 * Edit this array if you want to add/edit elements to menu
 */
const allItems: Array<MenuItem> = [
    {
        label: 'Home',
        icon: 'home',
        route: AppRoutes.home,
    },
    {
        label: "Tags",
        icon: "tag-outline",
        route: AppRoutes.tags
    },
    {
        label: "Profile",
        icon: "account-circle-outline",
        route: AppRoutes.profile
    },
    {
        label: 'Logout',
        icon: 'logout',
    },
]

// Styles
const styles = StyleSheet.create({
    items: {
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 0,
        backgroundColor: 'transparent',
        borderWidth: 0
    },
    row: {
        marginVertical: 25,
        justifyContent: 'center',
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: "contain",
    }
})

// Elements
const allItemsToRender = () => allItems.map((el, i) => (
    <Drawer.Item
        key={i}
        label={el.label}
        icon={el.icon}
        active={true}
        onPress={el.onPress}
        background={{color: AppDefTheme.colors.primary}}
        style={styles.items}
        />
)) 

const MenuView = (props: MenuViewProps) => {
    const { logout } = useContext(AuthContext);

    const runLogout = () => {
        props.setShowDialog(false)
        logout()
    }

    return (
        <>
            <Row style={styles.row}>
                <Image source={LOGO} style={styles.logo}/>
            </Row>
            {props.children}
            <SimpleAlert 
                visible={props.showDialog} 
                onDismiss={() => props.setShowDialog(false)}
                title="Logout"
                content="Are you sure?"
                onPressYes={runLogout}
                />
        </>
    )
}

export function Menu(props: PropsWithChildren<{}>): React.JSX.Element {
    const [guard] = useAuthGuard();

    const drawerContext = useContext(MenuContext);
    const nav = useNavigation();

    const [showDialog, setShowDialog] = useState(false);

    // Edit here the item childs of menu if you want to use dynamic variables/functions.
    for (const item of allItems) {
        if (item.label === 'Logout') {
            item.onPress = () => {
                setTimeout(() => drawerContext.current?.closeDrawer());
                setShowDialog(true);
            }
            continue
        }
        
        item.onPress = () => {
            setTimeout(() => drawerContext.current?.closeDrawer());
            nav.navigate(item.route as never ?? AppRoutes.home)
        }
    }

    return (
        <DrawerLayoutAndroid
            ref={drawerContext}
            renderNavigationView={() => <MenuView showDialog={showDialog} setShowDialog={setShowDialog} children={allItemsToRender()} />}
            drawerLockMode={ !(guard as GuardData).userToken ? 'locked-closed' : 'unlocked' }
            drawerWidth={drawerWidth}
            children={props.children}
            />
    )
}