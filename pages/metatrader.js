import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InnerHTML from 'dangerously-set-html-content'

import { pageOperations } from '../state/modules/pages'
import Document from '../components/Document'

function Page() {
  const dispatch = useDispatch()

  const { page } = useSelector((state) => ({
    page: state.pagesState.item,
  }))

  useEffect(() => {
    dispatch(pageOperations.fetchGetPage(3))
  }, [])

  return (
    <Document className="static-page">
      <InnerHTML html={`${page.content}`} />
    </Document>
  )
}

export default Page
