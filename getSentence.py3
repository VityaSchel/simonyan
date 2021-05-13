import markovify
import sys
import os

path = os.path.dirname(os.path.realpath(__file__))
file = open(path+"/compiledModel.json", 'r', encoding='utf-8')
model_json = file.read()
file.close()

reconstituted_model = markovify.Text.from_json(model_json)
generated = reconstituted_model.make_short_sentence(280, tries=100, max_overlap_ratio=0.2)

output = generated.encode('utf8')
sys.stdout.buffer.write(output)
