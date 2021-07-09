import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InnerHTML from 'dangerously-set-html-content'
import videoJS from 'video.js'

import { pageOperations } from '../state/modules/pages'
import Document from '../components/Document'

function Page() {
  const dispatch = useDispatch()
  const [currentLang, setCurrentLang] = useState('es-US')
  const [videoEl, setVideoEl] = useState(null)
  let player

  useEffect(() => {
    if (videoEl) {
      player = videoJS(
        videoEl,
        {
          autoplay: true,
          controls: true,
        },
        function onPlayerReady() {
          console.log('onPlayerReady', this)
        }
      )
    }
    return () => {
      if (player) {
        player.dispose()
      }
    }
  }, [videoEl])

  const onVideo = useCallback((el) => {
    if (el) {
      setVideoEl(el)
    }
  }, [])

  const { page } = useSelector((state) => ({
    page: state.pagesState.item,
  }))

  useEffect(() => {
    dispatch(pageOperations.fetchGetPage(1))
  }, [])

  return (
    <Document className="static-page iframe-page">
      <style jsx>{`
        .news-container {
          margin-bottom: 40px;
        }

        .news-container h2 {
          color: #fff;
          font-weight: bold;
          background: #000;
          margin: 0;
          padding: 5px 10px;
        }

        .news-container h2 span {
          width: 10px;
          height: 10px;
          display: inline-block;
          background: red;
          border-radius: 50%;
        }

        .news-container .video-js,
        .video-js {
          width: 100%;
        }
      `}</style>

      <div className="news-container">
        <h2>
          Noticias en vivo <span></span>
        </h2>
        <div data-vjs-player>
          <video id="video" ref={onVideo} className="video-js" width="100%" height="500">
            <source
              type="application/x-mpegURL"
              src="https://liveproduseast.akamaized.net/us/Channel-USTV-AWS-virginia-1/Source-USTV-440-1_live.m3u8"
            />
          </video>
        </div>
      </div>
      <div className="widget-box-container">
        <InnerHTML html={`${page.content}`} />
      </div>
    </Document>
  )
}

export default Page
