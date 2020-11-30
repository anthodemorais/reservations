<template>
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <strong class="card-title">{{ name }}</strong>
            <br>
            <span class="card-subtitle mb-2 text-muted">{{ capacity }} personnes - </span>
            <span class="card-subtitle mb-2 text-muted">Équipements : {{ equipements }}</span>
            <p class="card-text">{{ description }}</p>
            <button class="btn btn-primary" @click="bookRoom">Réserver</button>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import swal from 'sweetalert';
import api from '../requests';

function useRoomBlock(props) {
    function bookRoom() {
        api.addReservation(props.name, props.from, props.to, (data) => {
            if (data) {
                if (Object.prototype.hasOwnProperty.call(data, 'error')) {
                    swal('Oops...', data['error'], 'error')
                    console.log(data["error"])
                }
                else {
                    swal("C'est fait!", 'Votre réservation a été prise en compte', 'success')
                }
            }
            else {
                swal('Oops...', 'Le serveur a un problème, rééssaye plus tard', 'error')
            }
        })
    }

    return { bookRoom }
}

export default defineComponent({
    props: {
        name: String,
        description: String,
        capacity: Number,
        equipements: String,
        from: Number,
        to: Number
    },
    setup(props) {
        return { props, ...useRoomBlock(props) }
    }
})
</script>

<style>
.card {
    margin: 10px;
}
</style>