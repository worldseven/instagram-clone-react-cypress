import React, { Fragment, useRef, useState, useEffect, useCallback, cloneElement } from 'react';
import loadingGif from "../../../Assets/loadingGif.gif";

function List({ children, list, parentClass, childrenClass, parentId, intervalTime = 1100, areHomePosts = false }) {
    // refs
    const _isMounted = useRef(true);
    const timeouts = useRef(null);
    const observer = useRef(null);
    // STATE
    const [currLimit, setCurrLimit] = useState(5);
    const [hasMore, setLimit] = useState(true);
    const [isLoading, setLoading] = useState({
        loadingMoreItems: false,
        openingPost: false
    });
    // ----x--State---x-----
    const finalLimit = list?.length || null;

    useEffect(() => () => {
        window.clearTimeout(timeouts?.current);
        _isMounted.current = false;
    }, []);
    const increasePostsBy5 = () => {
        if (hasMore && _isMounted.current) {
            setLoading({ ...isLoading, loadingMoreItems: true });
            if (currLimit >= finalLimit) setLimit(false);
            timeouts.current = setTimeout(() => {
                if (_isMounted.current) {
                    setLoading({ ...isLoading, loadingMoreItems: false });
                    setCurrLimit(currLimit + 5);
                    window.clearTimeout(timeouts?.current);
                }
            }, intervalTime);
        }
    }
    const lastPostElementRef = useCallback(node => {
        if (observer?.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(enteries => {
            if (enteries[0].isIntersecting && hasMore && !isLoading?.loadingMoreItems) {
                increasePostsBy5();
            }
        });
        if (node) observer.current.observe(node);
    }, [hasMore, increasePostsBy5, isLoading]);

    return (
        <Fragment>
            <div id={parentId || ""} className={`${parentClass || ""}`}>
                {
                    list?.slice(0, currLimit)?.map((post, index) => {
                            const homePostsProps =  {
                                userName: post.userName  || "",
                                caption : post.caption || "",
                                contentType: post.contentType ||  "",
                                contentURL: post.contentURL || "",
                                contentName: post.contentName ||  "",
                                initialComments: post.comments ||  [],
                                initialLikes: post.likes ||  {},
                                initialPollData: post.pollData ||  {},
                                postDate: post.date ||  {},
                                location: post.location || "",
                                postId: post.id ||  "",
                                postOwnerId: post.postOwnerId ||  "",
                                userAvatar: post.userAvatarUrl ||  "",
                                youtubeData: post.youtubeData ||  {},
                                songInfo: post.songInfo ||  {},
                                isVerified: post.isVerified ||  false
                            }
                            if (currLimit === index + 1) {
                                return post &&
                                    <div className={`${childrenClass || ""} full--width`} key={post.id || index} ref={lastPostElementRef}>
                                        {cloneElement(children, {
                                            post,
                                            index,
                                            ...(areHomePosts) && homePostsProps
                                            })}
                                    </div>
                            } else {
                                return post && <div className={`${childrenClass || ""} full--width`}  key={post.id || index}>
                                    {cloneElement(children, {
                                        post,
                                        index,
                                        ...(areHomePosts) && homePostsProps
                                        })}
                                </div>
                            } 
                    })
                }
            </div>

            {
                parentClass !== "explore--upper--row" &&
                <div className="increase--posts--count flex-column">
                    <img
                        className={`${!isLoading?.loadingMoreItems && "hide__loading__animation"}`}
                        loading="lazy"
                        src={loadingGif}
                        alt="Loading..."
                    />
                </div>
            }
        </Fragment>

    )
}
export default List;