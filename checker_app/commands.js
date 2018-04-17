var commands = {}
var statusCodes = {}
commands['python 2']={}
commands['python 2']['compilation'] = "";
commands['python 2']['run'] = "python main.py";
commands['python 2']['extension'] = 'py'

commands['python 3']={}
commands['python 3']['compilation'] = "";
commands['python 3']['run'] = "python3 main.py";
commands['python 3']['extension'] = 'py'

commands['cpp']={}
commands['cpp']['compilation'] = "g++ main.cpp"
commands['cpp']['run'] = "./a.out"
commands['cpp']['extension'] = 'cpp'

commands['Node']={}
commands['Node']['compilation'] = ""
commands['Node']['run'] = "node main.js"
commands['Node']['extension'] = "js"

commands['ruby']={}
commands['ruby']['compilation'] = ""
commands['ruby']['run'] = "ruby main.rb"
commands['ruby']['extension'] = "rb"

commands['java']={}
commands['java']['compilation'] = "javac main.java"
commands['java']['run'] = "java main"
commands['java']['extension'] = "java"

statusCodes[0] = 'OK' ;
statusCodes[1] = 'Compiler error';
statusCodes[124] = 'Time limit exceeded';
statusCodes[139] = 'Segmentation fault' ;
statusCodes[136] = 'Floating point error'

module.exports={'commands':commands,'statusCodes':statusCodes};