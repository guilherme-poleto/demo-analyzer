import bz2
import sys

def decompress(input_file, output_file):
    try:
        with bz2.open(input_file, 'rb') as file:
            content = file.read()

        with open(output_file, 'wb') as output:
            output.write(content)

        print(f'File decompressed and saved to: {output_file}')
    except Exception as e:
        print(f'Erro: {e}')

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("python decompress.py <input_file> <output_file>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    decompress(input_path, output_path)
