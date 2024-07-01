import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/player/PlayerStorage";

import { PlayerCard } from "@components/PlayerCard";
import { ButtonIcon } from "@components/ButtonIcon";
import { Highlight } from "@components/Highlight";
import { ListEmpty } from "@components/ListEmpty";
import { Loading } from "@components/Loading";
import { Header } from "@components/Header";
import { Filter } from "@components/Filter";
import { Button } from "@components/Button";
import { Input } from "@components/Input";

import { AppError } from "@utils/AppError";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

type RouteParams = {
  group: string
}

export function Players() {
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState('TIME A');

  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInpuRef = useRef<TextInput>(null);

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.');
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {
      await playerAddByGroup(newPlayer, group);

      newPlayerNameInpuRef.current?.blur();

      fetchPlayersByTeam();
      setNewPlayerName('');
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message)
      } else {
        Alert.alert('Nova pessoa', 'Não foi possível adicionar!');
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoa', 'Não foi possível carregar as pessoas do time selecionado!');
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.');
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');
    } catch (error) {
      console.log(error);
      Alert.alert('Remover grupo', 'Não foi possível remover a turma!');
    }
  }

  function handleGroupRemove() {
    Alert.alert('Remover', 'Deseja remover o turma? ', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => groupRemove() }
    ])
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />
      <Highlight
        title={group}
        subtitle="Adicione a galera e separe os times"
      />

      <Form>
        <Input
          onSubmitEditing={handleAddPlayer}
          onChangeText={setNewPlayerName}
          inputRef={newPlayerNameInpuRef}
          value={newPlayerName}
          autoCorrect={false}
          placeholder="Nome da pessoa"
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>
      <HeaderList>
        <FlatList
          data={['TIME A', 'TIME B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={team == item}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>
      {
        isLoading ? <Loading /> :
          <FlatList
            data={players}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <PlayerCard
                name={item.name}
                onRemove={() => handlePlayerRemove(item.name)}
              />
            )}
            ListEmptyComponent={() => (
              <ListEmpty
                message="Não há pessoas nesse time!"
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
          />
      }
      <Button
        onPress={handleGroupRemove}
        title="Remover turma"
        type="SECUNDARY"
      />
    </Container>
  )
}