<template>
  <div class="container">
    <form @submit="onSubmit">
      <h2>Rechercher une salle</h2>
      <label for="from">De :</label>
      <input type='datetime-local' name="from" v-model='from' />
      <label for="to">À :</label>
      <input type='datetime-local' name="to" v-model='to' />
      <label for="capacity">Capacité (facultatif):</label>
      <input type='number' name="capacity" v-model='capacity' />
      <input type="submit" value="Rechercher" />
    </form>
    <div v-if="displayRooms" class="rooms-list">
      <strong v-if="availableRooms.length === 0" class="error">Aucune salle disponible pour cette plage horaire</strong>
      <Room v-for="room in availableRooms"
            :key="room.name"
            :name="room.name"
            :description="room.description"
            :capacity="room.capacity"
            :equipements="room.equipements.map(eq => eq.name).join(', ')"
            :from="new Date(from).getTime() / 1000"
            :to="new Date(to).getTime() / 1000"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import swal from 'sweetalert';
import api from './requests'
import Room from './components/Room'

function useAppBlock() {
  const from = ref(new Date())
  const to = ref(new Date())
  const capacity = ref(0)
  const availableRooms = ref([])
  const displayRooms = ref(false)

  function onSubmit(e) {
    e.preventDefault()

    const fromTs = new Date(from.value).getTime() / 1000
    const toTs = new Date(to.value).getTime() / 1000

    console.log(capacity.value)

    api.getAvailable(fromTs, toTs, capacity.value, (data) => {
      if (data) {
        if (Object.prototype.hasOwnProperty.call(data, 'error')) {
          swal('Oops...', 'Vous devez remplir tous les champs', 'error')
        }
        else {
          availableRooms.value = data['rooms']
          displayRooms.value = true
        }
      }
      else {
        swal('Oops...', 'Le serveur a un problème, rééssaye plus tard', 'error')
      }
    })
  }

  return {from, to, capacity, availableRooms, displayRooms, onSubmit}
}

export default {
  components: { Room },
  setup() {
    return { ...useAppBlock() }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

form {
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

input {
  margin-bottom: 20px;
}

.rooms-list {
  width: 100vw;
  padding: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* align-items: center; */
}
</style>
