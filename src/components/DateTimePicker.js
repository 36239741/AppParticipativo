import React, {useState, useEffect} from 'react';
import {View, Button, Platform, Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DatePicker ({ onChange, date }) {

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(Platform.OS === 'ios');

  })

  const onChangeInternal = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    onChange(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  function dataAtualFormatada(data){

        var dia  = data.getDate().toString()
        var diaF = (dia.length == 1) ? '0'+dia : dia
        var mes  = (data.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
        var mesF = (mes.length == 1) ? '0'+mes : mes
        var anoF = data.getFullYear()

    return diaF+"/"+mesF+"/"+anoF;
}



  return (
    <View>
      {Platform.OS !== 'ios' && (<View>
        <Button onPress={showDatepicker} title="Abrir Calendário" />
      </View>)}
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          dateFormat='shortdate'
          display="default"
          onChange={onChangeInternal}
        />
      )}
      {Platform.OS !== 'ios' && (<View style={{ display: 'flex', alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' }}>
            <Text>{dataAtualFormatada(new Date(date))}</Text>
      </View>) }
    </View>
  );
};