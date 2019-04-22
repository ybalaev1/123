import *as React from 'react'
import *as firebase from 'firebase'
import { Constants , registerRootComponent } from 'expo'
import { View,TouchableOpacity,StyleSheet,RefreshControl,LayoutAnimation,Modal,Text, ListView,FlatList,StatusBar,ScrollView, TextInput, Image,  WebView, Linking, ActivityIndicator, AppRegistry, CardItem,Body, Animated, SafeAreaView, Dimensions, Alert, ImageBackground} from 'react-native'
import { ListItem,SearchBar } from 'react-native-elements'
import {Feather} from '@expo/vector-icons'
import {Pw} from './css/PeopleView'
import {styles} from './css/styls'
import {Profilestyle} from './css/StyleProfile'
import {Main} from './css/StyleMain'
var items = []

export class PeopleTab extends React.Component {

  constructor(props) {
    super(props)
      this.state = {
        loading : false,
        data:[ ],
        val : 0,
        Rezident : ' ',
        NonMoney:'не указан',
        userNonPicture : 'https://res.cloudinary.com/bizpeople/image/upload/v1555684354/upload/userNON.png'
      }
      var userId = firebase.auth().currentUser.uid
      this.ref = firebase.database().ref('Users/')
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged( user => {
      this.setState({user})
    })
    this.ListeningItems(this.ref)
  }

  Update () {
    this.setState({data : items , value : ''})
  }
  ListeningItems (ref) {
    this.setState({loading : true})
    ref.on('value',(snap) => {
      snap.forEach((child) => {
        items.push({
          // id : child.key,
          Name : child.val().Name,
          Status : child.val().Status,
          Money : child.val().Money,
          UserImage : child.val().PhotoUser,
          Company : child.val().Company + ' , '
        })
      })
      this.setState({data : items , loading : false})
      this.Amount()
    })
  }
  _onRefresh = () => this.Update();

  Amount () {
    this.setState({val : items.length})
    if ( items.length <= 1)
    {
      this.setState({Rezident:' резидент'})
    }
    if ( items.length <= 4)
    {
      this.setState({Rezident:' резидента'})
    }
    else
    {
    this.setState({Rezident:' резидентов'})
    }

  }

  SearchUserOrPeople = ( text ) => {
    this.setState({value : text})

    const NewData = this.state.data.filter(item => {
      const ItemData = `${item.Name.toUpperCase()} ${item.Status.toUpperCase()} ${item.Company.toUpperCase()}`
      const TextData = text.toUpperCase()
      return ItemData.indexOf(TextData) > -1
    })
    this.setState({data:NewData})
  }

  key = ( item ) => item.id
  renderHeader = () => {
  return  (
    <SearchBar cancelButtonTitle='Отмена' searchIcon = {<Feather name = 'search' size='18' color='gray'/>} platform='ios' placeholder='Поиск по участникам' containerStyle={styles.Search}
       onChangeText={text => this.SearchUserOrPeople(text)} value={this.state.value} autoCorrect={false} clearIcon = {<Feather name = 'x' size='18' color='black' onPress={()=>this.Update()}/>}
       onClear={()=>this.Update()}
       onCancel = {()=>this.Update()}/>
     )
  }
  renderItem = ({ item }) =>
  <TouchableOpacity>
   <View style={styles.HeaderProfilePeople}>
       <View style={styles.ProfileBlockPeople}>
       <Image source={{uri:item.UserImage || this.state.userNonPicture}}
                   style={styles.ProfileImgPeople}/>
                   </View>
                   <View style={styles.ProfileInfoPeople}>
         <Text style={styles.ProfileNamePeople} >{item.Name}</Text>
         <Text style={styles.Profiled}>{item.Company}{' ' || ' , '}{item.Status}</Text>
           <Text style={styles.Profiled}>{'Годовой оборот компании:  '}{item.Money || this.state.NonMoney}</Text>
  </View>
  </View>
  </TouchableOpacity>

  render () {
    if (this.state.loading) {
    return (
      <View style={Main.container}>
           <StatusBar barStyle="light-content" backgroundColor='black'/>
         <View style={{paddingTop:Constants.statusBarHeight,backgroundColor:'black'}}></View>
           <View style={styles.SearchView}><Text style={styles.TextPeople} >{'Участники'}</Text></View>
             <SearchBar cancelButtonTitle='Отмена' searchIcon = {<Feather name = 'search' size='18' color='gray'/>} platform='ios' placeholder='Поиск по участникам' containerStyle={styles.Search}  />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    </View>
    )
  }
  return (
    <View style={Main.container}>
         <StatusBar barStyle="light-content" backgroundColor='black'/>
       <View style={{paddingTop:20,backgroundColor:'black'}}></View>
         <View style={styles.SearchView}><Text style={styles.TextPeople} >{'Участники'}</Text>
         <Text style={styles.RezText}>{this.state.val}{this.state.Rezident}</Text></View>
         <FlatList
         data = {this.state.data}
         ListHeaderComponent = {this.renderHeader}
         keyExtractor = {this.key}
         renderItem = {this.renderItem}
         refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this._onRefresh}
              />
            }
         />
       </View>
  )
}
}
export default registerRootComponent(PeopleTab)
