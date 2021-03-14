import React, {useContext, useEffect} from "react";
import Auxiliary from "../../Components/HOC/Auxiliary";
import "./Home.css";
import Post from "../../Components/Post/Post";
import {Avatar} from "@material-ui/core";
import {AppContext} from "../../Context";
import {Redirect, withRouter} from "react-router-dom";
import SuggestItem from "../../Components/SuggestItem/SuggestItem";
// import AuthPage from "../../Pages/AuthPage/AuthPage";
import {GoVerified} from "react-icons/go";
import {useAuthState} from "react-firebase-hooks/auth";  //firebase hook
import {auth} from "../../Config/firebase"; 
import {Skeleton} from "@material-ui/lab";
// import InstagramEmbed from "react-instagram-embed";
import {BsPlusSquare} from "react-icons/bs";

const Home =(props)=>{
    let {receivedData, handleMyLikes, handleSubmittingComments, suggestionsList, getUsersProfile, uid, handleFollowing, deletePost, handleSubComments, handleLikingComments, handleUsersModal, changeMainState} = useContext(AppContext);
    let posts = receivedData?.posts;
    const browseUser=(specialUid, name)=>{
        getUsersProfile(specialUid);
        props.history.push(`/user-profile/${name}`);
    }  
    let [user, loading] = useAuthState(auth);
    useEffect(() => {
        changeMainState("currentPage","Home");
        window.scrollTo(0,0);
        
    },[changeMainState]);
    const recievedAuth = localStorage.getItem("user");
    // useEffect(()=> {
        
        // if(!user){
            // if(recievedAuth && !user){
            //     console.log(user, loading);
            //     const {email, password} = JSON.parse(recievedAuth)
            // const returnPassowrd = (binary) => {
            //     // const newBin = binary.split(" ");
            //     const binCode = [];
            //     for(var i=0; i< binary.length; i++){
            //         binCode.push(String.fromCharCode(parseInt(binary[i], 2)));
            //     }
            //     return binCode.join("");
            // }
            //     auth.createUserWithEmailAndPassword(email, returnPassowrd(password));
            // };
            
        // }
    // },[]);
    return(
        <Auxiliary>
            {
                user || recievedAuth ?
            <section id="home" className="main--home--container ">
                 
                <div className="main--home--inner desktop-comp">
                    <div className="home--posts--side flex-column">
                    {
                        !loading && posts?.length >=1 ? 
                            posts?.map((post, i) =>{
                                return(      
                                            <Post key={post?.id}
                                            userName={post?.userName}
                                            myName = {receivedData?.userName}
                                            caption={post?.caption}
                                            contentType={post?.contentType}
                                            contentURL ={post?.contentURL}
                                            contentName ={post?.contentName}
                                            comments={post?.comments}
                                            likes={post?.likes}
                                            postDate={post?.date}
                                            id={uid}
                                            location={post?.location}
                                            index = {i}
                                            postId = {post?.id}
                                            postOwnerId = {post?.postOwnerId}
                                            userAvatar = {receivedData?.userAvatarUrl}
                                            handleMyLikes={handleMyLikes}
                                            handleSubmittingComments= {handleSubmittingComments}
                                            handleSubComments = {handleSubComments}
                                            handleLikingComments = {handleLikingComments}
                                            isVerified = {receivedData?.isVerified}
                                            handleUsersModal = {handleUsersModal}
                                            deletePost = {deletePost}
                                            />
                                )
                            })
                        : loading ?
                            (
                            <div className="w-100 flex-column">
                            <Skeleton variant="rect" height="100px" width="100%">
                                <div style={{ paddingTop: '40px' }} />
                            </Skeleton>
                            <Skeleton variant="rect" height="100px" width="100%">
                                <div style={{ paddingTop: '20px' }} />
                            </Skeleton>
                            <Skeleton variant="rect" height="100px" width="100%">
                                <div style={{ paddingTop: '20px' }} />
                            </Skeleton>
                            </div>
                          )
                        : posts?.length <1 ?
                            (
                                <div className="empty--posts--container flex-column">
                                    <div className="empty--posts--inner flex-column">
                                        <div className="plus--icon--container flex-column "><BsPlusSquare className="plus__icon"/></div>
                                        <h3>No posts have been made</h3>
                                        <p>When you share photos and videos, they'll <br/> be appear on your posts page</p>

                                        <span>Share your first photo or video</span>
                                    </div>
                                </div>
                            )
                        : null
                    }
                    </div>
                    <aside className="home--sider">
                        {
                            receivedData?.userName ?
                                <div className="side--user--info flex-row">
                                    <Avatar />
                                    <h5 className="flex-row" onClick={()=> props.history.push(`/profile`)}>{receivedData?.userName} { receivedData?.isVerified ? <GoVerified className="verified_icon"/> : null}</h5>  
                                </div>
                                
                            : null
                        }
                        {
                            suggestionsList.length >=1 ?
                            <div className="suggestions--home--container">
                                <div className="suggestions--header flex-row">
                                    <h6>Suggestions For you</h6>  
                                    <button>See all</button>
                                </div>
                                <div className="suggestions--list flex-column">
                                    <ul className="flex-column">
                                        {
                                            loading ?
                                            <div className="flex-column">
                                               <Skeleton variant="circle" width={40} height={40} />
                                               <Skeleton variant="circle" width={40} height={40} />
                                            </div>
                                            :
                                                suggestionsList && suggestionsList.length >0 && suggestionsList.filter(item => item?.uid !== receivedData?.uid ).map((user,i) =>{
                                                    return(
                                                        <SuggestItem key={i} userName={user?.userName} isVerified={user?.isVerified} userUid={user?.uid} userAvatarUrl={user?.userAvatarUrl}   browseUser={browseUser} handleFollowing={handleFollowing} receivedData={receivedData} />
                                                    )
                                                })                                            
                                            
                                        } 
                                        
                                    </ul>
                                </div> 
                            </div>
                            : null
                        }
                        <div className="instagram--embed--container">
                        {/* <InstagramEmbed
                            url="https://www.instagram.com/p/CGalYyrJNsX/"
                            // hideCaptions ={false}
                            containerTagName ="div"
                            className="instagram__embed"
                            // maxWidth={320}
                         /> */}
                        </div>
                        
                        
                    </aside>
                </div>
            </section>
            :
            <Redirect from="/" to="/auth"/>
           
        }
        </Auxiliary>
    )
}
export default withRouter(Home);