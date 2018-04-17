
exports.up = function(knex, Promise) {
  return Promise.all([

	  knex.schema.createTable('problems', function (t) {
	  	t.increments('id').primary();
	  	t.string('title','50').notNullable();
	  	t.string('statement','5000').notNullable();
	  	t.integer('time').notNullable();
	  	t.integer('memory').notNullable();
	  	t.timestamp('added').defaultTo(knex.fn.now());
	  	t.string('resources', '50').notNullable();
	  	t.string('inputdescription', '500').notNullable();
	  	t.string('outputdescription', '500').notNullable();
	  	t.string('inputexample', '100').notNullable();
	  	t.string('outputexample', '200').notNullable();
	  	t.string('explaination', '500').notNullable();
	  	t.integer('no_of_test_cases').notNullable();
	  }).then(function(){
	  	return knex('problems').insert([
	  		{
	  			title:"Test problem 1",
				statement:"Your task is simple. Read a list of number and display them to the standard output.",
				time :1,
				memory:"1536",			
				resources:"self",
				inputdescription:"First line of the standard input contains T, The number of integers to be read. Next T lines consist of a single 	integer each",
				outputdescription:"Output each integer in a seperate line.",
				inputexample: "4\n\
		       1\n\
		       2\n\
		       3\n\
		       4\n",
				outputexample: "1\n\
		       2\n\
		       3\n\
		       4\n", 			
       			explaination:"4 integers are to be read as specified in the first line.Next 4 lines contain a single integer as read by the standard 		input.",
       			no_of_test_cases: 2
	  		}

  		])
	  })
	  	
	]);
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('problems');
};
