import React, { Component } from "react";
import ReactLoading from 'react-loading'
import firebase from '../Firebase/firebase'
import 'react-toastify/dist/ReactToastify.css'
import '../Styles/liveChat.css'
import LocalStorageStrings from '../LoginStrings'
import 'bootstrap/dist/css/bootstrap.min.css'
import moment from 'moment'
class LiveChat extends Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading : false,
      isShowSticker : false,
      inputValue : '',
      currentPeerUser: this.props.currentPeerUser

    }
    this.currentUserName = localStorage.getItem(LocalStorageStrings.Name)
    this.currentUserId = localStorage.getItem(LocalStorageStrings.ID)
    this.currentUserPhoto = localStorage.getItem(LocalStorageStrings.PhotoURL)
    this.currentUserDocumentId = localStorage.getItem(LocalStorageStrings.FirebaseDocumentId)
    this.stateChanged = LocalStorageStrings.UPLOADED_CHANGED
    this.removeListener = null
    this.listMessage = []
    this.groupChatId = null
    this.currentPhotoFile = null
  }

  componentDidUpdate(prevProps, preState ){
    this.scrollToBottom()
    if(this.props.currentPeerUser !== prevProps.currentPeerUser){
      this.getListHistory()
    }
  }

  componentDidMount(){
    this.getListHistory()
  }

  static getDerivedStateFromProps = (props, state) =>{
    if(props.currentPeerUser !== state.currentPeerUser){
      return{currentPeerUser:props.currentPeerUser}
    }

  }
  componentWillUnmount(){
    if(this.removeListener){
      this.removeListener()
    }
  }

  scrollToBottom = () => {
    if(this.messageEnd){
      this.messageEnd.scrollIntoView({})
    }
  }
  onKeyboardPress = (event) =>{
    if(event.key === 'Enter'){
      this.onSendMessage(this.state.inputValue, 0)
    }
  }
  openListSticker = () =>{
    this.setState({isShowSticker: !this.state.isShowSticker})
  }
  getListHistory = () =>{
    if(this.removeListener){
        this.removeListener()
    }
    this.listMessage.length = 0
    this.setState({isLoading:true})
    if(this.hashString(this.currentUserId) <= this.hashString(this.state.currentPeerUser.id)){
      this.groupChatId = `${this.currentUserId}-${this.state.currentPeerUser.id}`
    }else{
      this.groupChatId = `${this.state.currentPeerUser.id}-${this.currentUserId}`
    }
    this.removeListener = firebase.firestore()
    .collection('Messages')
    .doc(this.groupChatId)
    .collection(this.groupChatId)
    .onSnapshot(
      onSnapshot => {
        onSnapshot.docChanges().forEach(change => {
          if(change.type === LocalStorageStrings.DOC){
            this.listMessage.push(change.doc.data())
          }
        })
        this.setState({isLoading:false})
      },
      err => {
        this.props.showToast(0, err.toString())
      }
    )
  }

  onSendMessage = (content, type) =>{
    if(this.state.isShowSticker && type === 2){
      this.setState({isShowSticker: false})
    }
    if(content.trim() === ''){
      return
    }
    const timestamp = moment()
    .valueOf()
    .toString()
    const itemMessage = {
      idFrom:this.currentUserId,
      idTo:this.state.currentPeerUser.id,
      timestamp:timestamp,
      content:content.trim(),
      type:type
    }
    firebase.firestore()
    .collection('Messages')
    .doc(this.groupChatId)
    .collection(this.groupChatId)
    .doc(timestamp)
    .set(itemMessage)
    .then( () => {
      this.setState({inputValue:''})
    })

  }

  
  
  render() {
    return (
      <div className='content'>
         {this.state.isLoading ? (
            <div className='viewLoading'>
              <ReactLoading
                type={"spin"}
                color={"#203152"}
                height={"10%"}
                width={"10%"}
              />
            </div>
          ) : null}

          <div class='contact-profile'>
            <img src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/nopic.jpg?alt=media&token=b761a372-3913-4d15-bbb1-d0ff54770e57"} />
            <p>{this.state.currentPeerUser.name}</p>
            <div class='social-media'>
              <i class='fa fa-facebook' aria-hidden='true'></i>
              <i class='fa fa-twitter' aria-hidden='true'></i>
              <i class='fa fa-instagram' aria-hidden='true'></i>
            </div>
          </div>

          
          <div className='viewListContentChat'>
            {this.renderListMessage()}
            <div style={{float:'left', clear:'both'}}
              ref ={ el => {
                this.messageEnd = el
              }}
            />

          </div>
          {this.state.isShowSticker ? this.renderStickers() : null}
          <div className='message-input'>
            <div className='wrap'>
              <input
              className='viewInput'
              placeholder='Type a Message'
              value={this.state.inputValue}
              onChange={event => {
                this.setState({inputValue:event.target.value})
              }}
              onKeyPress = {this.onKeyboardPress}
              /> 
              <img 
                  className='icOpenGallery'
                  src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/ic_photo.png?alt=media&token=fc05aab8-0d49-48cf-8f25-dea97e0ef5d2'
                  alt='icon open Gallery'
                  onClick= {() => this.refInput.click()}
              />
              <input
                   ref = {el => {
                     this.refInput = el
                   }}
                   accept='image/*'
                   className='viewInputGallery'
                   type='file'
                   onChange={this.onChoosePhoto}
              />
                <img 
                    className='icOpenSticker'
                    src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/ic_sticker.png?alt=media&token=fa55891d-d844-4a41-bd23-5c53b7306847'
                    alt='icon open Sricker'
                    onClick={this.openListSticker}
                
                />
                <img 
                    className='icSend'
                    src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/ic_send.png?alt=media&token=b77ccc69-91bf-4811-b286-e5a6be66c3a8'
                    alt='icon send'
                    onClick={() => this.onSendMessage(this.state.inputValue, 0)}
                
                />
            </div>
          </div>
      </div>
    );
  }
  onChoosePhoto = (event) =>{
    this.currentPhotoFile = event.target.files[0]

    if (this.currentPhotoFile) {
      this.setState({isLoading: true})
      this.currentPhotoFile = event.target.files[0]
      const prefixFiletype = event.target.files[0].type.toString();
      if(prefixFiletype.indexOf('image/') === 0){
        this.uploadPhoto()
      }else{
        this.setState({isLoading: false})
        this.props.showToast(0, 'this is not an image')
      }
    }else{
      this.setState({isLoading:false})
    }

  }
  uploadPhoto = () =>{
    if(this.currentPhotoFile){
      const timestamp = moment()
      .valueOf()
      .toString()
      const uploadTask = firebase.storage()
      .ref()
      .child(timestamp)
      .put(this.currentPhotoFile)
      uploadTask.on(
        LocalStorageStrings.UPLOADED_CHANGED,
        null,
        (err) => {
          this.setState({isLoading: false})
          this.props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.onSendMessage(downloadURL, 1);
            this.setState({ isLoading: false });
          });
        }
      );
    }else{
      this.setState({isLoading:false})
      this.props.showToast(0, 'file is null')
    }

  }

  renderListMessage =() =>{
    if(this.listMessage.length > 0){
      let viewListMessage = []
      this.listMessage.forEach((item,index) => {
        if(item.idFrom === this.currentUserId){
          if(item.type === 0){
            viewListMessage.push(
                <div className='viewItemRight' key={item.timestamp}>
                  <span className='textContentItem'>{item.content}</span>
                  </div>
            )
          }else if(item.type === 1){
            viewListMessage.push(
                <div className='viewItemRight2' key={item.timestamp}>
                  <img 
                      className='imgItemRight'
                      src={item.content}
                      alt='content Message' 
                      />
                  </div>
            )
          }else{
            viewListMessage.push(
                <div className='viewItemRight3' key={item.timestamp}>
                <img 
                    className='imgItemRightSticker'
                    src={this.getGifImage(item.content)}
                    alt='content Message' 
                    />
                </div>
            )
          }
        }else{
            if(item.type === 0){
              viewListMessage.push(
                <div className='viewWrapItemLeft' key={item.timestamp}>
                  <div className='viewWrapItemLeft3'>
                    {
                      this.isLastMessageLeft(index) ? (
                        <img 
                            src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/nopic.jpg?alt=media&token=e941ad65-265e-4671-8f7f-190510ac1644" } 
                            alt='avatar'
                            className='peerAvatarLeft'
                        />
                      ):(
                        <div className='viewPaddingLeft'></div>
                      )}
                      <div className='viewItemLeft'>
                        <span className='textContentItem'>{item.content}</span>
                      </div>
                  </div>
                        {this.isLastMessageLeft(index) ? (
                          <span className='textTimeLeft'>
                            <div className='time'>
                              {moment(Number(item.timestamp)).format('ll')}
                            </div>
                          </span>
                        ):null}
                </div>
              )
            }else if(item.type === 1){
                viewListMessage.push(
                  <div className='viewWrapItemLeft2' key={item.timestamp}>
                    <div className='viewWrapItemLeft3'>
                      {this.isLastMessageLeft(index)?(
                     <img 
                     src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/nopic.jpg?alt=media&token=e941ad65-265e-4671-8f7f-190510ac1644" } 
                     alt='avatar'
                     className='peerAvatarLeft'
                     />
                     ):(
                      <div className='viewPaddingLeft'> 

                      </div>
                    )}

                     <div className='viewItemLeft2'>
                        <img 
                            className='imgItemLeft'
                            src={item.content}
                            alt='content message' />
                      </div>
                    </div> 
                    
                    {this.isLastMessageLeft(index) ? (
                          <span className='textTimeLeft'>
                            <div className='time'>
                              {moment(Number(item.timestamp)).format('ll')}
                            </div>
                          </span>
                        ):null}
                  </div>
                )
              }else{
                viewListMessage.push(
                  <div className='viewWrapItemLeft2' key={item.timestamp}>
                    <div className='viewWrapItemLeft3'>
                      {this.isLastMessageLeft(index)?(
                     <img 
                     src={this.state.currentPeerUser.URL ? this.state.currentPeerUser.URL : "https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/nopic.jpg?alt=media&token=e941ad65-265e-4671-8f7f-190510ac1644" } 
                     alt='avatar'
                     className='peerAvatarLeft'
                     />
                     ):(
                      <div className='viewPaddingLeft'/>
                      )}
                      <div className='viewItemLeft3' key={item.timestamp}>
                        <img
                            className='imgItemLeftSticker'
                            src={this.getGifImage(item.content)}
                            alt='content Message'                        
                            />
                      </div>
                    </div>
                    {this.isLastMessageLeft(index) ? (
                          <span className='textTimeLeft'>
                            <div className='time'>
                            <div className='timesetup'>
                              {moment(Number(item.timestamp)).format('ll')}
                            </div>
                            </div>
                          </span>
                        ):null}
                  </div>
                    )

              }
        }
      })
      return viewListMessage
    }else{
      return(
        <div className='viewWrapSayHi'>
          <span className='textSayHi'>No Messages</span>
          <img 
              className='imgWaveHand'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/14-wave_hand.png?alt=media&token=742734eb-abe0-4047-aae7-637ec010ec12'
              alt='Wave Hand'
          />
        </div>
      )
    }
    
  }

  renderStickers = () =>{
    return(
      <div className='viewStickers'>
        <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l1.png?alt=media&token=831e5693-bacf-4117-b387-9a17c366bb6b'
              alt='stickers'
              onClick={ () => {this.onSendMessage('l1', 2)}}
        />
        <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l2.png?alt=media&token=f91ef8f9-5ca9-4f44-b0cb-b40798d2b09c'
              alt='stickers'
              onClick={ () => {this.onSendMessage('l2', 2)}}
        />
        <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l3.png?alt=media&token=d3f28129-5f0a-4786-a620-38bda9f64939'
              alt='stickers'
              onClick={ () => {this.onSendMessage('l3', 2)}}
        />
        <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l4.png?alt=media&token=dc9ee82f-1696-4d6c-b8c5-4514d5e467bd'
              alt='stickers'
              onClick={ () => {this.onSendMessage('l4', 2)}}
        />
        <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l5.png?alt=media&token=57aa4340-bd27-4bd6-b7d6-3c56fb862914'
              alt='stickers'
              onClick={ () => {this.onSendMessage('l5', 2)}}
        />
        <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l6.png?alt=media&token=5e0610a2-3de2-4f55-abe5-0fa91da9846b'
              alt='stickers'
              onClick={ () => {this.onSendMessage('l6', 2)}}
        />
         <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l7.png?alt=media&token=6303ff52-b1f4-4f99-bd55-a5a94ed6b8c7'
              alt='stickers'
              onClick={ () => {this.onSendMessage('l7', 2)}}
        />
        <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l8.png?alt=media&token=00c2fa50-1983-41f2-93aa-fe14d27e8c86'
              alt='stickers'
              onClick={ () => {this.onSendMessage('l8', 2)}}
        />
        <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/m1.gif?alt=media&token=3e1a5160-9397-48ce-90a6-c75e24ac6196'
              alt='stickers'
              onClick={ () => {this.onSendMessage('m1', 2)}}
        />
         <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/m1.gif?alt=media&token=3e1a5160-9397-48ce-90a6-c75e24ac6196'
              alt='stickers'
              onClick={ () => {this.onSendMessage('m2', 2)}}
        />
         <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/m3.gif?alt=media&token=ed9cedec-7775-440e-b16f-15ef3bca87bb'
              alt='stickers'
              onClick={ () => {this.onSendMessage('m3', 2)}}
        />
        <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/m4.gif?alt=media&token=9b670589-1f89-4f7c-89ec-b9d705bcc6f8'
              alt='stickers'
              onClick={ () => {this.onSendMessage('m4', 2)}}
        />
        <img 
              className='imgSticker'
              src='https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/m5.gif?alt=media&token=453f0bbb-3dd3-49e5-9e36-5c86ad6273c7'
              alt='stickers'
              onClick={ () => {this.onSendMessage('m5', 2)}}
        />
      </div>
    )
  }
  getGifImage = (value) =>{
    switch(value){
      case 'l1':
          return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l1.png?alt=media&token=831e5693-bacf-4117-b387-9a17c366bb6b'
      case 'l2':
          return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l2.png?alt=media&token=f91ef8f9-5ca9-4f44-b0cb-b40798d2b09c'
      case 'l3':
          return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l3.png?alt=media&token=d3f28129-5f0a-4786-a620-38bda9f64939'
      case 'l4':
        return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l4.png?alt=media&token=dc9ee82f-1696-4d6c-b8c5-4514d5e467bd'
      case 'l5':
        return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l5.png?alt=media&token=57aa4340-bd27-4bd6-b7d6-3c56fb862914'
      case 'l6':
        return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l6.png?alt=media&token=5e0610a2-3de2-4f55-abe5-0fa91da9846b'
      case 'l7':
        return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l7.png?alt=media&token=6303ff52-b1f4-4f99-bd55-a5a94ed6b8c7'
      case 'l8':
        return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/l8.png?alt=media&token=00c2fa50-1983-41f2-93aa-fe14d27e8c86'
      case 'm1':
        return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/m1.gif?alt=media&token=3e1a5160-9397-48ce-90a6-c75e24ac6196'
      case 'm2':
        return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/m2.gif?alt=media&token=e92ad011-613e-4a2d-a4ba-8950130cb2a0'
      case 'm3':
        return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/m3.gif?alt=media&token=ed9cedec-7775-440e-b16f-15ef3bca87bb'
      case 'm4':
        return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/m4.gif?alt=media&token=9b670589-1f89-4f7c-89ec-b9d705bcc6f8'
      case 'm5':
        return 'https://firebasestorage.googleapis.com/v0/b/chat-app-72544.appspot.com/o/m5.gif?alt=media&token=453f0bbb-3dd3-49e5-9e36-5c86ad6273c7'
    }
  }
  hashString = (str) =>{
    let hash = 0
    for(let i = 0; i < str.length; i++){
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
      hash = hash & hash
    }
    return hash
  }
  isLastMessageLeft = (index) =>{
    if((index + 1 < this.listMessage.length && this.listMessage[index + 1].idFrom === this.currentUserId) || 
    (index === this.listMessage.length - 1)){
        return true
    }else{
      return false
    }
  }

  // isLastMessageRight = (index) =>{
  //   if((index + 1 < this.listMessage.length && this.listMessage[index + 1].idFrom !== this.currentUserId) || 
  //   (index === this.listMessage.length - 1)){
  //       return true
  //   }else{
  //     return false
  //   }
    

  // //
  

}

export default LiveChat;
