import { useCallback, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { groupsGetAll } from 'src/storage/group/groupsGetAll';
import { AppError } from '@utils/AppError';

import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Header } from '@components/Header';
import { Button } from '@components/Button';

import { Container } from './styles';

export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('new');
  }


  async function fetchGroups(){
    try {
      const data = await groupsGetAll();
      setGroups(data);
    } catch (error) {
      if(error instanceof AppError) {
        Alert.alert('Novo Grupo', error.message)
      }else {
        Alert.alert('Novo Grupo', 'Não foi possível criar um grupo.');
        console.log(error);
      }
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', {group});
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  },[]));

  return (
    <Container>
      <Header />
      <Highlight
        title="Turma"
        subtitle="Jogue com a sua turma"
      />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <GroupCard
            title={item}
            onPress={() => handleOpenGroup(item)}
          />
        )}
          contentContainerStyle={groups.length === 0 && {flex: 1}}
          ListEmptyComponent={() => (
            <ListEmpty 
              message="Que tal cadastrar a primeira turma?"
            />
          )}
          showsVerticalScrollIndicator={false}
        />

        <Button title="Criar nova turma" onPress={handleNewGroup}/>
      
    </Container>
  );
}
