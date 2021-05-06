import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';


export default function TermsOfUse() {
    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={{fontWeight: 'bold', fontSize: 20, color:'#0371B6'}}>Termos de Uso</Text>
                <Text style={{fontWeight: 'bold', fontSize: 13, color:'#0371B6', marginBottom: 20}}>(Visualizar versões arquivadas)</Text>

                <Text style={{marginBottom: 20, textAlign: 'left', alignSelf: 'stretch'}}><Text style={{fontWeight: 'bold'}}>Última modificação:</Text> 03 de setembro de 2020</Text>

                <Text style={{marginBottom: 20, textAlign: 'left', alignSelf: 'stretch'}}>Agradecemos por usar nossos produtos e serviços (“Serviços”). Os  Serviços serão fornecidos pela Andromeda LTDA (“Andromeda”),
                    localizado em Foz do Iguaçu, Brasil.</Text>

                <Text  style={{marginBottom: 20, textAlign: 'left', alignSelf: 'stretch'}}>Ao usar nossos Serviços, você está concordando com estes termos. Leia-os com atenção.</Text>

                <Text  style={{marginBottom: 20, textAlign: 'left', alignSelf: 'stretch'}}>Nossos Serviços são muito diversos, portanto, às vezes, podem aplicar-se termos adicionais ou exigências de produtos
                    (inclusive exigências de idade). Os termos adicionais estarão disponíveis com os Serviços relevantes e 
                    esses termos adicionais se tornarão parte de nosso contrato com você, caso você use esses Serviços.</Text>

                <Text style={{fontWeight: 'bold', marginBottom: 20, textAlign: 'left', alignSelf: 'stretch'}}>Como usar nossos serviços</Text>

                <Text style={{marginBottom: 20, textAlign: 'left', alignSelf: 'stretch'}}>É preciso que você siga as políticas disponibilizadas a você dentro dos Serviços.</Text>

                <Text style={{marginBottom: 20, textAlign: 'left', alignSelf: 'stretch'}}>Não faça uso indevido de nossos Serviços. Por exemplo, não interfira com nossos Serviços nem tente acessá-los por um método 
                    diferente da interface e das instruções que fornecemos. Você pode usar nossos serviços somente conforme permitido por lei, 
                    inclusive leis e regulamentos de controle de exportação e reexportação. Podemos suspender ou deixar de fornecer nossos 
                    Serviços se você descumprir nossos termos ou políticas ou se estivermos investigando casos de suspeita de má conduta.</Text>

                <Text style={{fontWeight: 'bold', marginBottom: 20, textAlign: 'left', alignSelf: 'stretch'}}>Sua conta no Participativo - A rede social do cidadão</Text>

                <Text style={{marginBottom: 20, textAlign: 'left', alignSelf: 'stretch'}}>Você precisa criar uma Conta do Cidadão Participativo para utilizar os nossos Serviços.</Text>

            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20
    }
})