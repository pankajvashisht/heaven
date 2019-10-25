<template>
    <div>
        <div class="card padding"> <div class="card-header">
            <h2> <slot></slot> 
            </h2> 
            <div>
                <slot name="button">
                </slot> 
            </div>
         </div>
         </div>
    </div>  
</template>
<script>
export default {
    name:"headers",
    props:["name"],
   
}
</script>
<style>
   .padding{
       margin-bottom: 30px;
   } 
</style>