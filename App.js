//Styling
import {NativeBaseProvider, Box, Center, ScrollView, useTheme, Text, VStack, Divider, Heading, Input, Icon} from 'native-base';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
//AWS
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {listMovies} from './src/graphql/queries';
//React
import { useEffect, useState } from 'react';


Amplify.configure(awsconfig);

export default function App() {
  

  //AWS Functions
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []) //Empty array will run effect once
  
  const fetchMovies = async () => {
    try{
      const movieData = await API.graphql(graphqlOperation(listMovies));
      const movieList = movieData.data.listMovies.items;
      console.log('Movie list: \n', movieList);
      setMovies(movieList);
    }catch (e){
      console.log("Error on fetching movies", e);
    }
  }

  
  return (

      <NativeBaseProvider >
        <Box bg="gray.900" h="full" safeArea>
          {/**Header */}
          <Center _text={{color: "red.700", fontFamily: "Roboto", fontWeight: 700, letterSpacing: 1.3, fontSize: 36}}>
            InterFlix
          </Center>
          {/**Search */}
          <Center>
            <VStack w="90%" space={5} alignSelf="center" mb="3">
              <Input placeholder="Search" variant="filled" 
                    width="100%" borderRadius="10" py="1" px="2" 
                    borderWidth="2" borderColor="gray.700" bg="gray.800"
                    InputLeftElement={<Icon ml="2" size="4" color="gray.400" 
                    as={<Ionicons name="ios-search" />} />} />
            </VStack>
          </Center>
          {/**Recommended */}
          <Text color="gray.100" fontSize={24} fontWeight={500} left="5">For you</Text>
          
          {/**Horizontal Scroll */}
          <ScrollView horizontal={true} maxHeight="1/3" snapToInterval={390} decelerationRate="fast"> 
          {movies.map((movie, idx) => {
            return(
              
              <Box flex={1} bg="" m="5" key={movie.id} w={350}
                  _text={{color: "white"}} borderWidth={1} borderColor="gray.200">

                <Text color="white" fontWeight={600} fontSize={22} pl="2">{movie.title}</Text>
                <Box flex={1} bg="yellow.700" position="absolute" bottom="8" left="3" >
                  <Text color="white" >
                    {movie.description}
                  </Text>
                </Box>
                
              </Box>
            );
          })}
          </ScrollView>
        </Box>
      </NativeBaseProvider>
   
  );
}
