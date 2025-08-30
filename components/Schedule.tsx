
import LottieView from 'lottie-react-native'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
const Schedule = () => {
  return (
    <View style={style.container}>

     <View style={style.schedule}>
  <TouchableOpacity style={{ flex: 1 }}>
    <View style={{ flex: 1,justifyContent:'center'}}>
      <ImageBackground
        style={{ flex: 1,elevation:15,justifyContent:'center' }}
        source={require('../assets/images/cardsImg/card2.jpg')}
      >
        {/* Overlay with opacity */}
        <View style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
     
        }} />

        {/* Text content stays fully visible */}
      
          <Text style={style.scheduleTextHeading}>Your Schedule</Text>      
          <Text style={style.scheduleText}>Basic</Text>
      
      </ImageBackground>
    </View>
  </TouchableOpacity>
</View>

      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ flex: 1, flexDirection: 'row', gap: 10 }} >
          <TouchableOpacity style={{ flex: 1, elevation: 15, borderRadius: 15 }}>
            <View style={{ flex:1, borderRadius: 15, overflow: 'hidden' }}>
              <LottieView
                autoPlay
                source={require('../assets/lottie/diet.json')}
                style={{

                  height: '100%',
                  width: '100%',
                  backgroundColor: '#4d79bbdf',
                }}
              />
            </View>


          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(163, 24, 61, 1)', elevation: 15, borderRadius: 15,alignItems:'center',justifyContent:'center',}}>
                  <Text style={style.yourWeight}>
                    110
                  </Text>
                  <Text style={{fontWeight:'bold'}}>
                   Kg
                  </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'hsla(73, 15%, 50%, 1.00)',
          alignItems:'center',justifyContent:'center',
          elevation: 15, borderRadius: 15}}>

                  <Text style={style.payment}>3000</Text>

        </TouchableOpacity>
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
    borderRadius: 15,
    overflow: 'hidden'

  },
  scheduleText: {
    textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 60,
    fontWeight:'400',
    color:'rgba(233, 125, 53, 1)'
  },
   scheduleTextHeading: {
    textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 20,
    color:'white',
  },
  yourWeight:{
     textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 40,
    color:'rgba(233, 125, 53, 1)'
  },
  payment:{
    textAlign: 'center',
    fontFamily: 'Bebas',
    fontSize: 40,
  }


})

export default Schedule