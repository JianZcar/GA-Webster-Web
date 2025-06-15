<!-- Hero -->
<section class="text-center py-16 bg-white shadow">
  <h1 class="text-4xl font-bold mb-4">We are Bether Team</h1>
  <p class="text-lg text-gray-600">This is part of our thesis research.</p>
</section>

<!-- Team Section -->
<section class="max-w-5xl mx-auto py-12 px-4">
  <h2 class="text-2xl font-semibold text-center mb-10">Our Team</h2>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center">
    <a class="text-center" href="https://github.com/JovTim">
      <div class="w-24 h-24 rounded-full mx-auto shadow-md bg-gray-300 overflow-hidden relative">
        <img
          x-data="{ loaded: false }"
          @load="loaded = true"
          x-bind:class="loaded ? 'opacity-100' : 'opacity-0'"
          src="https://github.com/JovTim.png"
          alt="Jovan"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-500 hover:scale-125" />
      </div>
      <p class="mt-4 font-medium">Jovan Timosa</p>
    </a>

    <a class="text-center" href="https://github.com/JianZcar">
      <div class="w-24 h-24 rounded-full mx-auto shadow-md bg-gray-300 overflow-hidden relative">
        <img
          x-data="{ loaded: false }"
          @load="loaded = true"
          x-bind:class="loaded ? 'opacity-100' : 'opacity-0'"
          src="https://github.com/JianZcar.png"
          alt="Jian"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-500 hover:scale-125" />
      </div>
      <p class="mt-4 font-medium">Jian Zcar Esteban</p>
    </a>

    <a class="text-center" href="https://github.com/uzzielkyle">
      <div class="w-24 h-24 rounded-full mx-auto shadow-md bg-gray-300 overflow-hidden relative">
        <img
          x-data="{ loaded: false }"
          @load="loaded = true"
          x-bind:class="loaded ? 'opacity-100' : 'opacity-0'"
          src="https://github.com/uzzielkyle.png"
          alt="Uzziel"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-500 hover:scale-125" />
      </div>
      <p class="mt-4 font-medium">Uzziel Kyle Ynciong</p>
    </a>

    <a class="text-center" href="https://github.com/Carl2121">
      <div class="w-24 h-24 rounded-full mx-auto shadow-md bg-gray-300 overflow-hidden relative">
        <img
          x-data="{ loaded: false }"
          @load="loaded = true"
          x-bind:class="loaded ? 'opacity-100' : 'opacity-0'"
          src="https://github.com/Carl2121.png"
          alt="Carlos"
          class="absolute inset-0 w-full h-full object-cover transition-all duration-500 hover:scale-125" />
      </div>
      <p class="mt-4 font-medium">Carlos Heredero</p>
    </a>
  </div>
</section>
