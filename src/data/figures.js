// "Quién es": pistas de la más difícil a la más fácil. a = respuestas aceptadas (sin tildes)
export const FIGURES = [
  { n: 'Lionel Messi', a: ['messi', 'lionel messi', 'leo messi', 'la pulga', 'pulga', 'leo'], c: ['Nació en Rosario.', 'Su camiseta es la número 10.', 'Le dicen La Pulga.', 'Levantó la Copa del Mundo en Qatar 2022.'] },
  { n: 'Dibu Martínez', a: ['dibu', 'el dibu', 'dibu martinez', 'emiliano martinez'], c: ['Juega de arquero.', 'Usó la camiseta 23 en Qatar 2022.', 'Su apodo es Dibu.', 'Atajó penales en la final del Mundial 2022.'] },
  { n: 'Ángel Di María', a: ['fideo', 'el fideo', 'di maria', 'angel di maria', 'fideo di maria'], c: ['Juega por la banda y es muy rápido.', 'Usó la camiseta 11 en Qatar 2022.', 'Hizo un gol en la final del Mundial 2022.', 'Su apodo es Fideo.'] },
  { n: 'Julián Álvarez', a: ['julian alvarez', 'alvarez', 'julian', 'la arana', 'arana'], c: ['Es delantero.', 'Usó la camiseta 9 en Qatar 2022.', 'Hizo cuatro goles en el Mundial 2022.', 'Le dicen La Araña.'] },
  { n: 'Diego Maradona', a: ['maradona', 'diego maradona', 'diego', 'el diego', 'diego armando maradona', 'pelusa'], c: ['Nació en Lanús, provincia de Buenos Aires.', 'Usó la camiseta 10.', 'Hizo el gol de la Mano de Dios.', 'Fue el capitán campeón del mundo en 1986.'] },
  { n: 'Gabriel Batistuta', a: ['batistuta', 'gabriel batistuta', 'batigol', 'bati'], c: ['Fue delantero y goleador de la Selección.', 'Nació en Reconquista, Santa Fe.', 'Jugó los Mundiales de 1994, 1998 y 2002.', 'Su apodo es Batigol.'] },
  { n: 'Lionel Scaloni', a: ['scaloni', 'lionel scaloni'], c: ['No juega: es el entrenador.', 'Fue jugador antes de dirigir.', 'Se llama Lionel, igual que Messi.', 'Fue el DT campeón del mundo en 2022.'] },
  { n: 'Enzo Fernández', a: ['enzo fernandez', 'enzo', 'fernandez'], c: ['Juega de mediocampista.', 'Usó la camiseta 24 en Qatar 2022.', 'Fue elegido mejor jugador joven del Mundial 2022.', 'Su nombre es Enzo y su apellido, Fernández.'] },
  { n: 'Rodrigo De Paul', a: ['de paul', 'rodrigo de paul', 'rodrigo', 'rdp'], c: ['Juega en el mediocampo.', 'Usó la camiseta 7 en Qatar 2022.', 'Nació en Sarandí, provincia de Buenos Aires.', 'Sus iniciales son RDP.'] },
  { n: 'Lautaro Martínez', a: ['lautaro martinez', 'lautaro', 'el toro', 'toro'], c: ['Es delantero y hace goles.', 'Usó la camiseta 22 en Qatar 2022.', 'Nació en Bahía Blanca.', 'Le dicen El Toro.'] },
  { n: 'Alexis Mac Allister', a: ['mac allister', 'alexis mac allister', 'macallister', 'alexis'], c: ['Juega de mediocampista.', 'Usó la camiseta 20 en Qatar 2022.', 'Nació en Santa Rosa, La Pampa.', 'Le hizo un gol a Polonia en Qatar 2022.'] },
  { n: 'Cuti Romero', a: ['cuti romero', 'cristian romero', 'cuti', 'romero', 'cristian'], c: ['Juega de defensor.', 'Usó la camiseta 13 en Qatar 2022.', 'Nació en Córdoba.', 'Le dicen Cuti.'] },
  { n: 'Mario Kempes', a: ['kempes', 'mario kempes', 'el matador', 'matador', 'mario'], c: ['Fue delantero.', 'Nació en Bell Ville, Córdoba.', 'Fue goleador del Mundial 1978.', 'Le decían El Matador.'] },
  { n: 'Daniel Passarella', a: ['passarella', 'daniel passarella', 'el gran capitan', 'gran capitan'], c: ['Jugaba de defensor, pero hacía muchos goles.', 'Nació en Chacabuco, provincia de Buenos Aires.', 'Fue el capitán campeón del mundo en 1978.', 'Le decían El Gran Capitán.'] },
  { n: 'Sergio Agüero', a: ['aguero', 'sergio aguero', 'kun', 'el kun', 'kun aguero'], c: ['Fue delantero.', 'Ganó la medalla de oro en los Juegos Olímpicos de Pekín 2008.', 'Nació en Quilmes, provincia de Buenos Aires.', 'Le dicen El Kun.'] },
  { n: 'Javier Mascherano', a: ['mascherano', 'javier mascherano', 'jefecito', 'el jefecito'], c: ['Jugaba de mediocampista y también de defensor.', 'Nació en San Lorenzo, Santa Fe.', 'Fue de los jugadores con más partidos en la historia de la Selección.', 'Le decían El Jefecito.'] },
  { n: 'Juan Román Riquelme', a: ['riquelme', 'juan roman riquelme', 'roman', 'roman riquelme'], c: ['Jugaba de enganche, con la camiseta número 10.', 'Es un gran ídolo de Boca Juniors.', 'Se llama Juan, pero todos lo conocen por su segundo nombre.', 'Su nombre es Román.'] },
]

export const FIGURE_SETS = [
  { id: 'campeones', title: 'Campeones 2022', desc: 'Jugadores y técnico que ganaron el Mundial de Qatar.', names: ['Lionel Messi', 'Dibu Martínez', 'Ángel Di María', 'Julián Álvarez', 'Lionel Scaloni', 'Enzo Fernández', 'Rodrigo De Paul', 'Lautaro Martínez', 'Alexis Mac Allister', 'Cuti Romero'] },
  { id: 'leyendas', title: 'Leyendas', desc: 'Cracks de la historia de la Selección.', names: ['Diego Maradona', 'Gabriel Batistuta', 'Mario Kempes', 'Daniel Passarella', 'Sergio Agüero', 'Javier Mascherano', 'Juan Román Riquelme'] },
]
