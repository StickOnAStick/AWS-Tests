import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NativeBaseProvider, Box, Center, ScrollView} from 'native-base';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {listMovies} from './src/graphql/queries';
import { useEffect, useState } from 'react';

Amplify.configure(awsconfig);

export default function App() {

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

      <NativeBaseProvider>
        <Box bg="gray.900" h="full" safeArea>
          <ScrollView horizontal={true} maxHeight="1/4" >
          {movies.reverse().map((movie, idx) => {
            return(
              
              <Box bg="blue.500" m="5" key={movie.id} w="1/3"> This is the movie:
                <Center>{movie.title}</Center>
                <Center>{movie.description}</Center>
              </Box>
            );
          })}
          </ScrollView>
        </Box>
      </NativeBaseProvider>
   
  );
}
