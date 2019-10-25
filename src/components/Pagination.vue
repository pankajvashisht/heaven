<template>
    <div class="container">
        <ul class="pagination justify-content-end" style="margin:20px 0">
            <li class="page-item"><a class="page-links" @click="$emit('Previous')">Previous</a></li>
            <li class="page-item"><a class="page-links" v-for="pageNumber in pages" v-bind:key="pageNumber" @click="$emit('enter', pageNumber)"> {{pageNumber}}</a></li>
            <li class="page-item"><a class="page-links" @click="$emit('next')">Next</a></li>
        </ul>
    </div>
</template>
<script>
export default {
    name:"Pagination",
    props:{"total": {type:Number,default:10},"limit" : Number,"currentPage":Number},
    data() {
        return {
            page: Math.round(this.total/this.limit,0),
            perPage: this.limit || 20,
            pages: [],
        };
  },
  created:function(){
      this.setPages();
  },
  watch: {
    posts () {
      this.setPages();
    }
  },
  update:function(){
    this.setPages();
  },
  methods: {
    setPages () {
      this.page =  Math.round(this.total/this.limit,0);
      for (let index = 1; index <= this.page; index++) {
        this.pages.push(index);
      }
    },
  },
  
  
}
</script>
<style scoped>
    .page-links {
    position: relative;
    padding: 0.5rem 0.75rem;
    border: 1px solid #dee2e6;
}
</style>