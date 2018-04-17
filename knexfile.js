module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host : 'ec2-54-243-130-33.compute-1.amazonaws.com',
    	user : 'ymhinispdqmare',
    	password : '6f043e5315cab62938614cf8e51b8c2d15ae8de784198bb52f5e3ee83b3b74e2',
    	database : 'd401032bgtoted',
    	port: 5432,
    	ssl: true
    },
    pool: {
      min: 2,
      max: 10
    }
    //debug: true
  }
}
