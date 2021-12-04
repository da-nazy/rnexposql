import React,{useState,useEffect} from 'react';
import {View,Text,StatusBar,TextInput,Button,TouchableOpacity} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { FlatList } from 'react-native-gesture-handler';
  
const db=SQLite.openDatabase("db.db");

const App=()=>{

 
  const[category,setCategory]=useState("");
  const[categories,setCategories]=useState([]);
  const [edit,setEdit]=useState(null);
 // console.log(db);
  const  createTables=()=>{
   db.transaction(txn=>{
     txn.executeSql(
      `CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20));`,
    [],
    (sqlTxn,res)=>{
     console.log("Table created succefully");
    },
    error=>{console.log("error on creating table"+ error)
    },
    
     );
   });

  };
  const updateCategory=(id,name)=>{
    console.log("edit",id,name);
    db.transaction(txn=>{
      txn.executeSql(`update categories set name = ? where id = ?;`, [name,id],
      (sql,res)=>{
        console.log("updated")
        getCategories();
        setEdit(null);
      },
      (error)=>{
        console.log(error,"error");
      }
    )
    })
  }
   const deleteCategory=(id)=>{
     db.transaction(txn=>{
       txn.executeSql(`delete from categories where id = ?;`, [id],
       getCategories(),
       (sql,res)=>{console.log("deleted")},
       (error)=>{console.log(error)},
       );
       
     })
   }
  const addCategory=()=>{
    if(!category){
      alert("Enter Category");
      return false;
    }

    db.transaction(txn=>{
      txn.executeSql(
        'INSERT INTO categories (name) VALUES (?)',
        [category],
        (sql,res)=>{ 
           console.log(`${category}  added successfully`); 
           getCategories();
           setCategory("");
            },
        error=>{
          console.log("Erro on adding category " + error);
        },
      );
    });
  }
  const getCategories=()=>{
  db.transaction(txn=>{
    txn.executeSql(
      `SELECT * FROM categories ORDER BY id DESC`,
      [],
      (sqlTxn,res)=>{
        console.log("categories retrieved successfully");
        let len=res.rows.length;
        if(len>0){
          let results=[];
          for(let i=0; i<len;i++){
            let item=res.rows.item(i);
            results.push({id:item.id,name:item.name});
          }
          setCategories(results);
        }
      },
      (error)=>{console.log('error on getting categories '+error)}
    )
  })
  };
  
  const renderCategory=({item})=>{
   return(
     <View style={{flexDirection:'row',
     paddingVertical:12,
     paddingHorizontal:10,
     borderBottomWidth:1,
     borderColor:'#ddd',justifyContent:'space-between'}}>
       <Text style={{marginRight:9}}>
         {item.id}
       </Text>
       <Text>{item.name}</Text>
       <TouchableOpacity style={{borderWidth:1}} onPress={()=>setEdit(item)}><Text>Edit</Text></TouchableOpacity>
     
       <TouchableOpacity style={{borderWidth:1}} onPress={()=>deleteCategory(item.id)}><Text>Remove</Text></TouchableOpacity>
     </View>
   )
  }
  useEffect(async()=>{
   
    createTables();
    getCategories();
  
    
  },[])

 
  return(
    <View style={{height:'100%'}}>
      <StatusBar backgroundColor="orange"/>
      <TextInput
      placeholder="Enter category"
      value={category}
      onChangeText={(e)=>setCategory(e)}
      style={{marginHorizontal:8,borderWidth:1,height:50,margin:5}}
      />
      <Button title="Submit" onPress={addCategory}/>
       <FlatList data={categories} style={{marginBottom:3}}
        renderItem={renderCategory}
        key={cat=>cat.id}
        />
          {edit&&<View style={{marginBottom:5,margin:5,flexDirection:'row',justifyContent:'space-between'}}>
          <TextInput
          placeholder="Edit"
          value={edit?edit.name:'nothing'}
          onChangeText={(e)=>setEdit({...edit,name:e})}
          style={{height:39,width:'70%',borderWidth:1}}
          />
          <TouchableOpacity onPress={()=>updateCategory(edit.id,edit.name)} style={{width:'15%',justifyContent:'center',borderWidth:1}}><Text style={{textAlign:'center'}}>Edit</Text></TouchableOpacity>
        </View>}
           </View>
  )
}

export default App;