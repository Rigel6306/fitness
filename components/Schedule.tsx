
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Schedule = () => {
  return (
    <View style={style.container}>

      <View style={style.schedule} >
        <TouchableOpacity style={{ flex: 1 }}>
          <ImageBackground
            style={{ flex: 1, padding: 10 }}
            source={require('../assets/images/cardsImg/card3.jpg')}>
            <Text style={style.scheduleText}>Your Schedule</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row',  gap: 10 }} >
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'green', borderRadius: 15 }}></TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'pink', borderRadius: 15, }}></TouchableOpacity>
        </View>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'blue', borderRadius: 15 }}></TouchableOpacity>
      </View>

    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    flexDirection: 'row',
    gap: 10,
  },
  schedule: {
    flex: 1,
    backgroundColor: 'green',
    borderRadius: 15,
    overflow: 'hidden'

  },
  scheduleText: {
    textAlign: 'left',
    fontFamily: 'Marmeled',
    fontSize: 20,
  }

})

export default Schedule