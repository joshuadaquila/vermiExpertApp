import { Image, StyleSheet, Text, View } from "react-native"

const About = () => {
  return(
    <View style={{ padding: 10 }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ alignSelf: 'flex-start', paddingHorizontal: 5, borderRadius: 10, backgroundColor: 'white' }}>
            <Text style={{ color: '#111211', alignSelf: 'flex-start', fontWeight: 'bold' }}>ABOUT US</Text>
          </View>
        </View>

        <View style={{ justifyContent: 'center', height: '100%'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image source={require('../resources/splashscreen_image.png')} style={{height: 150, width: 150, marginBottom: 10}}></Image>
        </View> 
        <Text style={{color: 'white'}}>
          We are a passionate team of researchers and developers dedicated to advancing sustainable agricultural practices through technology. Our thesis project, Vermicomposting Assessment Using Expert System, is focused on creating a hybrid solution to address the challenges of managing vermicomposting systems effectively.
        </Text>
        <Text style={{color: 'white', marginTop: 10}}>
          With a shared vision for environmental sustainability, we have combined expertise in software development, sensor integration, and data science to design an intelligent system that monitors and assesses key vermibed conditions—moisture, temperature, and pH level. Our goal is to empower users with actionable insights and recommendations, ensuring optimal worm health and nutrient-rich compost production.
        </Text>
        <Text style={{color: 'white', marginTop: 10}}>
          By leveraging real-time data and decision-making algorithms, we strive to make vermicomposting more efficient, accessible, and impactful for individuals, communities, and agricultural enterprises.
        </Text>

        <Text style={{color: 'white', marginTop: 10}}>
          Join us in our journey to innovate for a greener future!
        </Text>
        </View>
    </View>
  )
}
const styles = StyleSheet.create({
  main: {
    backgroundColor: '#111211',
    height: '100%',
    color: 'white',
  },
  header: {
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  headerText: {
    color: '#111211',
    fontWeight: 'bold',
  }
})
export default About