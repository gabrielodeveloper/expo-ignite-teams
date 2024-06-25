import { PlayerCard } from "@components/PlayerCard";
import { ButtonIcon } from "@components/ButtonIcon";
import { Highlight } from "@components/Highlight";
import { Header } from "@components/Header";
import { Filter } from "@components/Filter";
import { Input } from "@components/Input";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { FlatList } from "react-native";
import { useState } from "react";

export function Players() {
  const [team, setTeam] = useState('TIME A');
  const [players, setPlayers] = useState(['Gabriel']);

  return (
    <Container>
      <Header showBackButton />
      <Highlight
        title="Nome da turma"
        subtitle="Adicione a galera e separe os times"
      />

      <Form>
        <Input
          placeholder="Nome da pessoa"
          autoCorrect={false}
        />
        <ButtonIcon icon="add" />
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
        <FlatList 
          data={players}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <PlayerCard 
              name={item}
              onRemove={() => {}}
             />
          )}
        />
    </Container>
  )
}