import { ButtonIcon } from "@components/ButtonIcon";
import { Highlight } from "@components/Highlight";
import { Header } from "@components/Header";

import { Container, Form } from "./styles";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { FlatList } from "react-native";

export function Players() {
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

      <FlatList 
        data={['time a', 'time b']}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Filter title={item} />
        )}
        horizontal
      />

    </Container>
  )
}