import React, { useState } from 'react'

import { Text } from 'react-native'

export default function MoreLessText({ children, numberOfLines }) {
  const [isTruncatedText, setIsTruncatedText] = useState(false)
  const [showMore, setShowMore] = useState(true)

  return isTruncatedText ? (
    <>
      <Text numberOfLines={showMore ? numberOfLines : 0}>{children}</Text>
      <Text style={{fontWeight: 'bold'}} onPress={() => setShowMore(!showMore)}>
        {showMore ? 'Mostrar mais' : 'Esconder'}
      </Text>
    </>
  ) : (
    <Text
      onTextLayout={(event) => {
        const { lines } = event.nativeEvent
        setIsTruncatedText(lines?.length > numberOfLines)
      }}
    >
      {children}
    </Text>
  )
}