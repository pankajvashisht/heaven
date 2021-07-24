<template>
  <div class="container">
    <ul
      class="pagination justify-content-end"
      style="margin:20px 0"
    >
      <li class="page-item">
        <a
          class="page-links"
          @click="previous"
        >Previous</a>
      </li>
      <li class="page-item">
        <a
          v-for="pageNumber in pages"
          :key="pageNumber"
          :class="{ active: pageNumber === currentPage, 'page-links': 'page-links' }"
          @click="numberClick(pageNumber)"
        > {{ pageNumber }}</a>
      </li>
      <li class="page-item">
        <a
          class="page-links"
          @click="next"
        >Next</a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
    name:"Pagination",
    props:[ "total", 'limit', "displayed"],
    data() {
        return {
            page: Math.round(this.total/this.limit,0),
            perPage: this.limit || 20,
            pages: [],
            currentPage: 1,
        };
  },
  watch: {
    total: function() {
      this.setPages();
    },
    currentPage: function(){
      this.setPages();
    }
  },
  created:function(){
      this.setPages();
  },
  update:function(){
    this.setPages();
  },
  methods: {
    setPages () {
      this.page =  Math.round(this.total/this.limit,0);
      if (this.displayed > this.page ) this.displayed = this.page; 
      let start = this.currentPage - Math.floor(this.displayed / 2); 
      start = Math.max(start, 1);
      start = Math.min(start, 1 + this.page - this.displayed); 
      this.pages = Array.from({length: this.displayed }, (el, i) => start + i);
    },
    numberClick: function(page){
      this.currentPage = page;
      this.setPages();
      this.$emit('handle-click', page)
    },
    previous: function(){
      if(this.currentPage === 1){
        return false;
      }
      this.currentPage = this.currentPage -1;
      this.$emit('handle-click', this.currentPage)
    },
    next: function(){
      if(this.currentPage === this.page){ 
        return false; 
      } 
      this.currentPage = this.currentPage +1;
      this.$emit('handle-click', this.currentPage)
    }

  },
  
  
}
</script>
<style scoped>
    .page-links {
    position: relative;
    padding: 0.5rem 0.75rem;
    border: 1px solid #dee2e6;
    cursor: pointer;
}
.active{
  background-color: dodgerblue; 
  color: white !important;
  border: 1px solid dodgerblue;

}

</style>